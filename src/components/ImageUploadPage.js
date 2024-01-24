import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CompareSlider } from './CompareSlider';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThreeDots } from 'react-loader-spinner';
import { downloadPhoto } from './utils';

const SERVER_DOWN = false
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
    },
    footer: {
        fontSize: '0.8rem',
        color: '#007AFF',
        marginTop: '30px'
    },
    loader: { // Style for the loader
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F3F3F3', // Light gray background for a clean, Apple-like aesthetic
        color: '#333' // Dark gray text for contrast and readability
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

    const [remainingRequests, setRemainingRequests] = useState(3);

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
    const handleDownloadClick = () => {
        if (restoredImage) {
          downloadPhoto(restoredImage, "restored-image.png");
        }
      };

      function downloadImage(imageUrl, filename = 'downloaded_image.png') {
        const anchorElement = document.createElement('a');
        anchorElement.href = imageUrl;
        anchorElement.download = filename; 
        anchorElement.target = '_blank'; // Open in a new tab if it navigates
        document.body.appendChild(anchorElement); // Append to the document
        anchorElement.click(); // Trigger click to download
        document.body.removeChild(anchorElement); // Remove the element after download
      }
      
    const handleGenerateClick = async () => {
        if (SERVER_DOWN) {
            setError("The servers are currently under maintenance, please check back later");
           
            return
        }
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
                setError(data.error || 'An error occurred');
            } else {
                // Success response
                setRestoredImage(data.image_url);
                setRemainingRequests(prevCount => prevCount - 1)
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <motion.div style={style} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <motion.button style={style.homeButton} onClick={() => navigateToUpload()} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Home</motion.button>
            <motion.h1 initial={{ y: -250 }} animate={{ y: -10 }} transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}>Upload Your Car Image</motion.h1>
            {/* <motion.p style={style.infoText} initial={{ y: -250 }} animate={{ y: -10 }} transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}>Note: You can only generate 3 images per day. (hopefully 🤞)</motion.p> */}
            <motion.p style={style.infoText} initial={{ y: -250 }} animate={{ y: -10 }} transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}>You have {remainingRequests} {remainingRequests === 1 ? 'request' : 'requests'} remaining for today. 😉</motion.p>
            <motion.input
                type="text"
                placeholder="Enter your prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={style.input}
                initial={{ y: -250 }}
                animate={{ y: -10 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
            />
            <motion.select
                value={styleOption}
                onChange={(e) => setStyleOption(e.target.value)}
                style={style.input}
                initial={{ y: -250 }}
                animate={{ y: -10 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
            >
                <option value="">Select Style</option>
                <option value="Photographic">Photographic</option>
                <option value="Cinematic">Cinematic</option>
                <option value="Anime">Anime</option>
                <option value="Fantasy art">Fantasy art</option>
                <option value="Neonpunk">Neonpunk</option>
            </motion.select>
            {error && <p>Error: {error}</p>}
            <div {...getRootProps()} style={style.dropzone}>
                <input {...getInputProps()} accept="image/*" />
                <p>Drag 'n' drop your car image here, or click to select a file</p>
                {originalImageUrl && <img src={originalImageUrl} alt="Preview" style={style.image}/>}
            </div>
            <motion.button style={style.button} onClick={handleGenerateClick} disabled={loading} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {loading ? <ThreeDots color="#EFEFF0" height={50} width={50} /> : 'Generate'}
            </motion.button>
            {restoredImage && (
                <>
                    <div style={style.compareSlider}>
                        <CompareSlider original={originalImageUrl} restored={restoredImage} />
                    </div>
                   <button onClick={() => downloadImage(restoredImage, "restoredImage.png")} style={style.button}>
                        Download Image
                        </button>

                </>
            )}
            <p style={style.footer}>Built by <a href="https://twitter.com/elisha_bulalu" target="_blank" rel="noopener noreferrer">@elisha_bulalu</a></p>
        </motion.div>
    );
};

export default ImageUploadPage;