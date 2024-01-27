import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const DemoSection = () => {
  const carImages = ['/bima/og.JPG', '/bima/design.png', '/bima/neon.png', '/bima/military.png'];
  const roomImages = ['/room/ogroom.jpeg', '/room/pinkroom.png', '/room/tropicalbed.png', '/room/livingroom.jpeg', '/room/profsittingroom.png', '/room/tropicallivingroom.png'];

  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState('rooms'); // 'cars' or 'rooms'
  const navigate = useNavigate();

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

  const imageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
    padding: '2rem 0'
  };

  const imageStyle = {
    width: 'calc(90% / 3 - 2rem)',
    maxWidth: 'calc(90% / 3 - 2rem)',
    height: 'auto',
    borderRadius: '20px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    transition: 'transform .3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)'
    }
  };

  const tabStyle = {
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    background: '#f0f0f0',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 10px',
    '&:focus': {
      outline: 'none',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)'
    }
  };

  const activeTabStyle = {
    ...tabStyle,
    background: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem 0', zIndex: isModalOpen ? -1 : 1 }}>
        <Button
          style={key === 'cars' ? activeTabStyle : tabStyle}
          onClick={() => setKey('cars')}
        >
          Cars
        </Button>
        <Button
          style={key === 'rooms' ? activeTabStyle : tabStyle}
          onClick={() => setKey('rooms')}
        >
          Rooms
        </Button>
        <Button
          style={key === 'rooms' ? activeTabStyle : tabStyle}
          onClick={() => navigateToExplore()}
        >
          explore
        </Button>
      </div>
      {key === 'cars' && (
        <div style={imageContainerStyle}>
          {carImages.map((src, index) => (
            <img
              key={`car-${index}`}
              src={src}
              alt={`Car ${index}`}
              style={imageStyle}
              onClick={() => openModal(index)}
            />
          ))}
        </div>
      )}
      {key === 'rooms' && (
        <div style={imageContainerStyle}>
          {roomImages.map((src, index) => (
            <img
              key={`room-${index}`}
              src={src}
              alt={`Room ${index}`}
              style={imageStyle}
              onClick={() => openModal(index + carImages.length)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div onClick={closeModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2,
        }}>
          <img
            src={key === 'cars' ? carImages[current] : roomImages[current - carImages.length]}
            alt="demo large"
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              borderRadius: '20px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
    </>
  );
};

export default DemoSection;
