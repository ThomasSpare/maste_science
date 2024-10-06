import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css'; // Create this CSS file for styling

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

return (
    <div className="hamburger-menu">
        <Link to="/">
            <img className='maste-logo-hamburger' src="https://res.cloudinary.com/djunroohl/image/upload/v1727695386/Untitled_2x_tpfxxy.png" alt="Maste Logo" />
        </Link>
        <button className="hamburger-icon" onClick={toggleMenu}>
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`menu ${isOpen ? 'open' : ''}`}>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/What_is_Maste">What is Maste</Link></li>
                <li><Link to="/Aims">Aims</Link></li>
                <li><Link to="/links">Links</Link></li>
                <li><Link to="/partners">Partners</Link></li>
                <li><Link to="/workstructure">Work Structure</Link></li>
                <li><Link to="/public_docs">Public Docs</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/promotion">Promotion</Link></li>
                <li><Link to="/templates">Templates</Link></li>
                <li><Link to="/publications">Publications</Link></li>
                <li><Link to="/deliverables_public">Deliverables Public</Link></li>
                <li><Link to="/contacts">Contacts</Link></li>
                <li><Link to="/allnews">All News</Link></li>
                <li><Link to="/contactlists">Contact Lists</Link></li>
                <li><Link to="/meetings">Meetings</Link></li>
                <li><Link to="/reports">Reports</Link></li>
                <li><Link to="/WP1">WP1</Link></li>
                <li><Link to="/WP2">WP2</Link></li>
                <li><Link to="/WP3">WP3</Link></li>
                <li><Link to="/WP4">WP4</Link></li>
                <li><Link to="/WP5">WP5</Link></li>
                <li><Link to="/WP6">WP6</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><Link to="/Upload">Upload</Link></li>
            </ul>
        </nav>
    </div>
);
};

export default HamburgerMenu;