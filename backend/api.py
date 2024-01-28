from flask import Flask, request, jsonify, send_file
from diffusers import StableDiffusionXLAdapterPipeline, T2IAdapter, EulerAncestralDiscreteScheduler, AutoencoderKL
from diffusers.utils import load_image
from controlnet_aux.midas import MidasDetector
import torch
from io import BytesIO
import traceback
import PIL
from flask_cors import CORS
import uuid
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


# TODO 🚨
# scale the api ✅ ?
# create mobile version
# limit the number of requests for users ✅
# expose the images on firebase to the UI ✅
# enable generations for more images

app = Flask(__name__)
CORS(app) 

# Check if CUDA is available and set the device accordingly
# device = "cuda" if torch.cuda.is_available() else "cpu"

#firebase Configes
import firebase_admin
from firebase_admin import credentials, storage


cred = credentials.Certificate("path-to-your-json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'storage-bucket-name'
})
# Global variables for models
pipe = None
midas_depth = None
models_loaded = False

#setup limits
MY_IP = ''

def custom_key_func():
    if request.remote_addr == MY_IP:
        return "my-unique-identifier"
    return get_remote_address()

limiter = Limiter(

    key_func=custom_key_func,  # Use custom key function
    default_limits=["3 per day"]
)


# Then attach the app to Limiter
limiter.init_app(app)


def load_models():
    global pipe, midas_depth, models_loaded
    if not models_loaded:
        device = "cuda" if torch.cuda.is_available() else "cpu"

        # Initialize the T2IAdapter
        adapter = T2IAdapter.from_pretrained(
            "TencentARC/t2i-adapter-depth-midas-sdxl-1.0", torch_dtype=torch.float16, variant="fp16"
        ).to(device)

        # Initialize other model components
        model_id = 'stabilityai/stable-diffusion-xl-base-1.0'
        euler_a = EulerAncestralDiscreteScheduler.from_pretrained(model_id, subfolder="scheduler")
        vae = AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=torch.float16)

        # Initialize the StableDiffusionXLAdapterPipeline
        pipe = StableDiffusionXLAdapterPipeline.from_pretrained(
            model_id, vae=vae, adapter=adapter, scheduler=euler_a, torch_dtype=torch.float16, variant="fp16"
        ).to(device)
        pipe.enable_xformers_memory_efficient_attention()

        # Initialize the MidasDetector
        midas_depth = MidasDetector.from_pretrained(
            "valhalla/t2iadapter-aux-models", filename="dpt_large_384.pt", model_type="dpt_large"
        ).to(device)
        
        models_loaded = True
        


style_list = [
    {
        "name": "(No style)",
        "prompt": "{prompt}",
        "negative_prompt": "",
    },
    {
        "name": "Cinematic",
        "prompt": "cinematic still {prompt} . emotional, harmonious, vignette, highly detailed, high budget, bokeh, cinemascope, moody, epic, gorgeous, film grain, grainy",
        "negative_prompt": "anime, cartoon, graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured",
    },
    {
        "name": "3D Model",
        "prompt": "professional 3d model {prompt} . octane render, highly detailed, volumetric, dramatic lighting",
        "negative_prompt": "ugly, deformed, noisy, low poly, blurry, painting",
    },
    {
        "name": "Anime",
        "prompt": "anime artwork {prompt} . anime style, key visual, vibrant, studio anime,  highly detailed",
        "negative_prompt": "photo, deformed, black and white, realism, disfigured, low contrast",
    },
    {
        "name": "Digital Art",
        "prompt": "concept art {prompt} . digital artwork, illustrative, painterly, matte painting, highly detailed",
        "negative_prompt": "photo, photorealistic, realism, ugly",
    },
    {
        "name": "Photographic",
        "prompt": "cinematic photo {prompt} . 35mm photograph, film, bokeh, professional, 4k, highly detailed",
        "negative_prompt": "drawing, painting, crayon, sketch, graphite, impressionist, noisy, blurry, soft, deformed, ugly",
    },
    {
        "name": "Pixel art",
        "prompt": "pixel-art {prompt} . low-res, blocky, pixel art style, 8-bit graphics",
        "negative_prompt": "sloppy, messy, blurry, noisy, highly detailed, ultra textured, photo, realistic",
    },
    {
        "name": "Fantasy art",
        "prompt": "ethereal fantasy concept art of  {prompt} . magnificent, celestial, ethereal, painterly, epic, majestic, magical, fantasy art, cover art, dreamy",
        "negative_prompt": "photographic, realistic, realism, 35mm film, dslr, cropped, frame, text, deformed, glitch, noise, noisy, off-center, deformed, cross-eyed, closed eyes, bad anatomy, ugly, disfigured, sloppy, duplicate, mutated, black and white",
    },
    {
        "name": "Neonpunk",
        "prompt": "neonpunk style {prompt} . cyberpunk, vaporwave, neon, vibes, vibrant, stunningly beautiful, crisp, detailed, sleek, ultramodern, magenta highlights, dark purple shadows, high contrast, cinematic, ultra detailed, intricate, professional",
        "negative_prompt": "painting, drawing, illustration, glitch, deformed, mutated, cross-eyed, ugly, disfigured",
    },
    {
        "name": "Manga",
        "prompt": "manga style {prompt} . vibrant, high-energy, detailed, iconic, Japanese comic style",
        "negative_prompt": "ugly, deformed, noisy, blurry, low contrast, realism, photorealistic, Western comic style",
    },
]


styles = {k["name"]: (k["prompt"], k["negative_prompt"]) for k in style_list}
STYLE_NAMES = list(styles.keys())
DEFAULT_STYLE_NAME = "Photographic"

def apply_style(style_name: str, positive: str, negative: str = "") -> tuple[str, str]:
    p, n = styles.get(style_name, styles[DEFAULT_STYLE_NAME])
    return p.replace("{prompt}", positive), n + negative

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Yoo!!! WE UPP 🤟"}), 200


# Custom error handler for rate limits
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error="Your Rate limit  has exceeded, Please try again later"), 429

@app.route('/test-ip')
def test_ip():
    return jsonify(remote_ip=request.remote_addr)


@app.route('/generate-image', methods=['POST'])
@limiter.limit("3 per day", error_message='Rate limit exceeded. Please try again later.')

def generate_image():
    try:
        load_models()
        if 'image' not in request.files:
            return jsonify({"error": "Image file is required"}), 400

        image_file = request.files['image']
        image = PIL.Image.open(image_file.stream)

        # Extract prompt and style from form data
        user_prompt = request.form.get('prompt', '')
        style = request.form.get('style', DEFAULT_STYLE_NAME)


        if not user_prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Apply the selected style to the prompt
        full_prompt, negative_prompt = apply_style(style, user_prompt)
        if 'image' in request.files:
            image_file = request.files['image']
            image = PIL.Image.open(image_file.stream)
        else:
            data = request.json
            image_url = data.get('image_url')
            if image_url:
                image = load_image(image_url)
            else:
                return jsonify({"error": "Image file or URL is required"}), 400



  
        image = midas_depth(
            image, detect_resolution=512, image_resolution=1024
        )
        # Generate the image using the Stable Diffusion model
        gen_images = pipe(
            prompt=full_prompt,
            negative_prompt=negative_prompt,
            image=image,
            num_inference_steps=30,
            adapter_conditioning_scale=1,
            guidance_scale=7.5,  
        ).images[0]

        # Convert the generated image to bytes
        img_byte_arr = BytesIO()
        gen_images.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        # Upload the image to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(f"images/{uuid.uuid4()}.png")
        blob.upload_from_file(img_byte_arr, content_type='image/png')
        blob.make_public()

        # Return the image URL
        return jsonify({"image_url": blob.public_url})


    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "oops, something went wrong while generating"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    
    
    
