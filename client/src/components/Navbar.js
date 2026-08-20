import React from 'react';
import { Link } from 'react-router-dom'; 

function Navbar() {
    return (
        <nav className="top-nav">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/details">Entry Details</Link>
            <Link to="/about">About</Link>
        </nav>
    );
}

export default Navbar;