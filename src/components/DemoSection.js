import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DemoSection = () => {
    const images = ['/bima/og.JPG', '/bima/design.png', '/bima/neon.png', '/bima/military.png', '/bima/whitebima.png', './bima/animebm.png'];
    const [current, setCurrent] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleNext = () => {
        setCurrent(current === images.length - 1 ? 0 : current + 1);
    };

    const handlePrev = () => {
        setCurrent(current === 0 ? images.length - 1 : current - 1);
    };

    const openModal = (index) => {
        setCurrent(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const navigateToExplore = () => {
        navigate('/explore');
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div id="demo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h2>latest Pimps 🔥</h2>
            <button onClick={navigateToExplore} style={{
                position: 'absolute',
                top: '400px',
                right: '10px',
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 0 10px #007AFF, 0 0 40px #007AFF, 0 0 80px #007AFF',
                transition: 'all 0.3s ease-in-out',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                outline: 'none',
                background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                fontSize: '0.8rem'
            }}>Explore</button>
            <div style={{ width: '80%', margin: '2rem 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem',  }}>
                {images.map((img, index) => (
                    <img key={img} src={img} alt={`Transformation ${index}`} style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', cursor: 'pointer' }} onClick={() => openModal(index)} />
                ))}
            </div>
            {isModalOpen && (
                <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', animation: 'fadeIn 0.5s' }}>
                    <img src={images[current]} alt="demo large" style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '10px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)' }} />
                </div>
            )}
        </div>
    );
};

export default DemoSection;


