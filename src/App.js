import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DemoSection from './components/DemoSection';

import './App.css';

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <HeroSection />
      <DemoSection />
   
    </div>
  );
}

export default App;
