import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from './firebase';
import { Spinner } from 'react-bootstrap';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import 'bootstrap/dist/css/bootstrap.min.css';

const Explore = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [key, setKey] = useState('cars'); // 'cars' or 'rooms'
    const navigate = useNavigate();

    useEffect(() => {
        if (key === 'cars') {
            const fetchImages = async () => {
                try {
                    const storageRef = ref(storage, 'images/');
                    const result = await listAll(storageRef);

                    let metadataPromises = result.items.map(imageRef => 
                        getMetadata(imageRef).then(metadata => ({
                            url: getDownloadURL(imageRef),
                            lastModified: new Date(metadata.updated)
                        }))
                    );

                    let metadata = await Promise.all(metadataPromises);
                    metadata.sort((a, b) => b.lastModified - a.lastModified);

                    let urls = await Promise.all(metadata.map(item => item.url));
                    console.log(urls);

                    setImages(urls);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching images:", error);
                }
            };

            fetchImages();
        }
    }, [key]);

    

    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const navigateHome = () => {
        navigate('/');
    };

    const imageStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Default for desktop
        gap: '1rem',
        padding: '1rem',
        margin: 'auto',
        marginTop: '60px',
        '@media screen and (max-width: 600px)': { // Media query for mobile
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Adjusted for smaller screens
        }
    };

    const imgStyles = {
        width: '100%',
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

    const tabStyles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2rem 0',
        zIndex: 1,
        borderBottom: 'none',
        '& .nav-link': {
            color: '#333',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            padding: '1rem 2rem',
            borderRadius: '30px',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                color: '#007AFF',
                backgroundColor: '#f0f0f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            },
            '&.active': {
                color: '#007AFF',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }
        }
    };

    return (
        <>
            <button style={homeButtonStyle} onClick={navigateHome}>Home</button>
            <Tabs defaultActiveKey="cars" id="controlled-tab-example" onSelect={(k) => setKey(k)} className={tabStyles}>
                <Tab eventKey="cars" title="Cars">
                    <div style={imageStyles}>
                        {loading ? (
                            <div style={loaderStyles}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            images.map((url, index) => (
                                <div key={index} style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '10px' }}>
                                    <img src={url} alt={`Content ${index}`} style={imgStyles} onClick={() => handleImageClick(url)} />
                                </div>
                            ))
                        )}
                    </div>
                </Tab>
                <Tab eventKey="rooms" title="Rooms">
                    <div style={imageStyles}>
                        <p>Coming Soon...</p>
                        {/* Here you will insert the logic for fetching and displaying room images in the future */}
                    </div>
                </Tab>
            </Tabs>

            {selectedImage && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} onClick={closeImage}>
                    <img src={selectedImage} alt="Selected" style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '10px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)' }} />
                </div>
            )}
        </>
    );

};

export default Explore;
