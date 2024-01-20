import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CompareSlider } from './CompareSlider';
import { useNavigate } from 'react-router-dom';

const style = {
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif',
    color: '#333',
    textAlign: 'center',
    padding: '5rem 0',
    dropzone: {
        border: '2px dashed #007AFF',
        borderRadius: '10px',
        padding: '20px',
        cursor: 'pointer',
        marginBottom: '20px',
        width: '300px', // Adjust the width as per your requirement
        margin: '0 auto' // Center align the dropzone
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        width: '80%',
        maxWidth: '400px',
        borderRadius: '5px',
        border: '1px solid #007AFF',
        outline: 'none'
    },
    button: {
        backgroundColor: '#007AFF',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
    },
    homeButton: {
        backgroundColor: 'transparent',
        color: '#007AFF',
        border: '1px solid #007AFF',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        top: '10px',
        left: '10px'
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
        borderRadius: '5px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
    },
    compareSlider: {
        maxWidth: '60%',
        margin: '0 auto',
        marginTop: '20px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
    },
    infoText: {
        fontSize: '1rem',
        color: '#007AFF',
        marginTop: '10px'
    }
};

const ImageUploadPage = () => {
    const [file, setFile] = useState(null);
    const [restoredImage, setRestoredImage] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [styleOption, setStyleOption] = useState('');
    const navigate = useNavigate();
      const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setFile(file);
        // Create a URL for the original file
        const fileUrl = URL.createObjectURL(file);
        setOriginalImageUrl(fileUrl);
    }, []);

    const navigateToUpload = () => {
        navigate('/');
    };

    // console.log("file",file)

    const handleGenerateClick = async () => {
        if (!file) {
            setError('Please upload an image first.');
            return;
        }

        setLoading(true);
        setError(null);
        setRestoredImage(null);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('prompt', prompt);
        formData.append('style', styleOption);

        for (let [key, value] of formData.entries()) { 
            console.log(key, value); 
        }

        try {
            const response = await fetch("https://fhgx6ogubqjq3l-5000.proxy.runpod.net/generate-image", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
        
            const data = await response.json();
          
            if (response.status === 429) {
                
                // Handle rate limit error
                setError("Rate limit exceeded. Please try again later.");
            } else if (!response.ok) {
                // Handle other types of errors
                const errorData = await response.json();
                console.log("kiko humu", errorData)
                setError(errorData.error || 'An error occurred');
            } else {
                // Success response
                const data = await response.json();
                setRestoredImage(data.image_url);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div style={style}>
            <button style={style.homeButton} onClick={() => navigateToUpload()}>Home</button>
            <h1>Upload Your Car Image</h1>
            <p style={style.infoText}>Note: You can only generate 3 images per day. (hopefully 🤞)</p>
            <input
                type="text"
                placeholder="Enter your prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={style.input}
            />
            <select
                value={styleOption}
                onChange={(e) => setStyleOption(e.target.value)}
                style={style.input}
            >
                <option value="">Select Style</option>
                <option value="Photographic">Photographic</option>
                <option value="Cinematic">Cinematic</option>
                <option value="Anime">Anime</option>
                <option value="Fantasy art">Fantasy art</option>
                <option value="Neonpunk">Neonpunk</option>
                {/* Add more style options here */}
            </select>
            {error && <p>Error: {error}</p>}

            <div {...getRootProps()} style={style.dropzone}>
                <input {...getInputProps()} accept="image/*" />
                <p>Drag 'n' drop your car image here, or click to select a file</p>
                {originalImageUrl && <img src={originalImageUrl} alt="Preview" style={style.image}/>}
            </div>
            <button style={style.button} onClick={handleGenerateClick} disabled={loading}>
                {loading ? 'Generating...' : 'Generate'}
            </button>
            {/* {restoredImage && <img src={restoredImage} alt="Restored" style={style.image}/>} */}
                  {/* Display CompareSlider when both images are available */}
                  {originalImageUrl && restoredImage && (
                <div style={style.compareSlider}>
                    <CompareSlider original={originalImageUrl} restored={restoredImage} />
                </div>
            )}
            
        </div>
    );
};

export default ImageUploadPage;
