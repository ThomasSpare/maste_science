import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './HamburgerMenu.css'; // Create this CSS file for styling
import { CdsButton } from '@cds/react/button';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0(); // Get user and auth methods from Auth0

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="hamburger-menu">
            <Link to="/" onClick={closeMenu}>
                <img className='maste-logo-hamburger' src="https://res.cloudinary.com/djunroohl/image/upload/v1727695386/Untitled_2x_tpfxxy.png" alt="Maste Logo" />
            </Link>
            <button className="hamburger-icon" onClick={toggleMenu}>
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <nav className={`menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/What_is_Maste" onClick={closeMenu}>What is Maste</Link></li>
                    <li><Link to="/Aims" onClick={closeMenu}>Aims</Link></li>
                    <li><Link to="/partners" onClick={closeMenu}>Partners</Link></li>
                    <li><Link to="/workstructure" onClick={closeMenu}>Work Structure</Link></li>
                    <li><Link to="/public_docs" onClick={closeMenu}>Public Docs</Link></li>
                    <li><Link to="/deliverables_public" onClick={closeMenu}>Deliverables Public</Link></li>
                    <li><Link to="/contacts" onClick={closeMenu}>Contacts</Link></li>
                    <li><Link to="/allnews" onClick={closeMenu}>All News</Link></li>
                    {isAuthenticated && (
                        <>
                            <li><Link to="/search" onClick={closeMenu}>Search</Link></li>
                            <li><Link to="/WP1" onClick={closeMenu}>WP1</Link></li>
                            <li><Link to="/WP2" onClick={closeMenu}>WP2</Link></li>
                            <li><Link to="/WP3" onClick={closeMenu}>WP3</Link></li>
                            <li><Link to="/WP4" onClick={closeMenu}>WP4</Link></li>
                            <li><Link to="/WP5" onClick={closeMenu}>WP5</Link></li>
                            <li><Link to="/WP6" onClick={closeMenu}>WP6</Link></li>
                            <li><Link to="/promotion" onClick={closeMenu}>Promotion</Link></li>
                            <li><Link to="/publications" onClick={closeMenu}>Publications</Link></li>
                            <li><Link to="/reports" onClick={closeMenu}>Reports</Link></li>
                            <li><Link to="/contactlists" onClick={closeMenu}>Contact Lists</Link></li>
                            <li><Link to="/deliverables" onClick={closeMenu}>Deliverables</Link></li>
                            <li><Link to="/meetings" onClick={closeMenu}>Meetings</Link></li>
                            <li><Link to="/templates" onClick={closeMenu}>Templates</Link></li>
                            <li><Link to="/settings" onClick={closeMenu}>Settings</Link></li>
                            <li><Link to="/Upload" onClick={closeMenu}>Upload</Link></li>
                        </>
                    )}
                    {isAuthenticated ? (
                        <li>
                            <CdsButton onClick={() => logout({ returnTo: window.location.origin })}>
                                Logout
                            </CdsButton>
                        </li>
                    ) : (
                        <li>
                            <CdsButton onClick={() => loginWithRedirect()}>
                                Login
                            </CdsButton>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default HamburgerMenu;