import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

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
        maxWidth: '400px'
    },
    button: {
        backgroundColor: '#007AFF',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    }
};

const ImageUploadPage = () => {
    const [file, setFile] = useState(null);
    const [restoredImage, setRestoredImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [styleOption, setStyleOption] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
    }, []);

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

        try {
            const response = await fetch("https://your-backend-endpoint/generate-image", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (response.status === 200) {
                setRestoredImage(data.image_url);
            } else {
                setError(data.error);
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
            <h1>Upload Your Car Image</h1>
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
                <option value="style1">Style 1</option>
                <option value="style2">Style 2</option>
                <option value="style3">Style 3</option>
                {/* Add more style options here */}
            </select>
            {error && <p>Error: {error}</p>}
            <div {...getRootProps()} style={style.dropzone}>
                <input {...getInputProps()} accept="image/*" />
                <p>Drag 'n' drop your car image here, or click to select a file</p>
            </div>
            <button style={style.button} onClick={handleGenerateClick} disabled={loading}>
                {loading ? 'Generating...' : 'Generate'}
            </button>
            {restoredImage && <img src={restoredImage} alt="Restored" />}
        </div>
    );
};

export default ImageUploadPage;
