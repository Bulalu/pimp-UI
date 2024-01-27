import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    const navigateToUpload = () => {
        navigate('/upload');
    };

    return (
        <div id="hero" style={{ 
            fontFamily: 'inherit', // Inherits font from global styles
            textAlign: 'center', 
            padding: '5rem 0', 
            maxWidth: '100vw', 
            margin: '0 auto' 
        }}>
            <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                padding: '0 1rem' 
            }}>Re-imagine Your Assets Today</h1>
            <p style={{ 
                fontSize: '1.5rem', 
                margin: '2rem 0', 
                padding: '0 1rem' 
            }}>Experience the future of  styling.</p>
            <button style={{ 
                backgroundColor: '#007AFF', 
                color: '#FFFFFF', 
                border: 'none', 
                padding: '1rem 2rem', 
                borderRadius: '50px', 
                fontSize: '1.2rem', 
                cursor: 'pointer', 
                boxShadow: '0 0 10px #007AFF, 0 0 40px #007AFF, 0 0 80px #007AFF',
                transition: 'all 0.3s ease-in-out',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                outline: 'none',
                background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                width: '80%',
                maxWidth: '300px',
                margin: '0 auto'
            }} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
            onClick={navigateToUpload}
            >Get Started</button>
        </div>
    );
};

export default HeroSection;

