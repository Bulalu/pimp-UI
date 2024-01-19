import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import DemoSection from './components/DemoSection';
import ImageUploadPage from './components/ImageUploadPage'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <DemoSection />
            </>
          } />
          <Route path="/upload" element={<ImageUploadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
