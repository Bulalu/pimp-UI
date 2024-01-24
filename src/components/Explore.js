import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from './firebase';
import { ThreeDots } from 'react-loader-spinner';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

const Explore = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const storageRef = ref(storage, 'images/');
                const result = await listAll(storageRef);

                let urlPromises = result.items.map(imageRef => getDownloadURL(imageRef));
                const urls = await Promise.all(urlPromises);

                setImages(urls);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        }
        fetchImages();
    }, []);

    const handleImageClick = (url) => {
        setSelectedImage(url);
    }

    const closeImage = () => {
        setSelectedImage(null);
    }

    const navigateHome = () => {
        navigate('/');
    }

    const imageStyles = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        maxWidth: '100%',
        margin: 'auto',
        marginTop: '60px' // Add margin to top to make space for the home button
    };

    const imgStyles = {
        width: '300px',
        height: '300px',
        objectFit: 'cover',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.05)'
        }
    };

    const loaderStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F3F3F3',
        color: '#333'
    };

    const homeButtonStyle = {
        backgroundColor: 'transparent',
        color: '#007AFF',
        border: '1px solid #007AFF',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1100, // Ensure the button is above other elements
        margin: '20px' // Add margin to place the button nicely
    };

    return (
        <>
            <button style={homeButtonStyle} onClick={navigateHome}>Home</button>
            <div style={imageStyles}>
                {loading ? (
                    <div style={loaderStyles}>
                        <ThreeDots color="#007AFF" height={80} width={80} />
                    </div>
                ) : (
                    images.map((url, index) => (
                        <div key={index} style={{ width: '300px', height: '300px', overflow: 'hidden', borderRadius: '10px' }}>
                            <img src={url} alt={`Content ${index}`} style={imgStyles} onClick={() => handleImageClick(url)} />
                        </div>
                    ))
                )}
                {selectedImage && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} onClick={closeImage}>
                        <img src={selectedImage} alt="Selected" style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '10px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)' }} />
                    </div>
                )}
            </div>
        </>
    );
};

export default Explore;

