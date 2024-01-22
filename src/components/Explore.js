import React, { useState, useEffect } from 'react';
import { storage } from './firebase';
import { ThreeDots } from 'react-loader-spinner';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const Explore = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const storageRef = ref(storage, 'images/'); 
                const result = await listAll(storageRef); 
                console.log("ListAll result:", result); 
                let urlPromises = result.items.map(imageRef => getDownloadURL(imageRef));
                const urls = await Promise.all(urlPromises);
                console.log("Image URLs:", urls); 
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

    const imageStyles = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        maxWidth: '100%',
        margin: 'auto'
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

    return (
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
    );
};

export default Explore;

