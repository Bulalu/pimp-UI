import React from 'react';

const Navbar = () => {
    return (
        <nav>
            <div className="logo">pimpGPT</div>
            <ul className="nav-links">
                <li><a href="#hero">Home</a></li>
                <li><a href="#demo">Demo</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
