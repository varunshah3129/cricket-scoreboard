import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">CRICBOARD</div>
                <button className="menu-button" onClick={toggleSidebar}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <nav className={`navigation ${isSidebarOpen ? 'open' : ''}`}>
                    <NavLink to="/score" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        Score
                    </NavLink>
                    <NavLink to="/standings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        Standings
                    </NavLink>
                    <NavLink to="/videos" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        Videos
                    </NavLink>
                    <NavLink to="/ranking" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                        ICC Rankings
                    </NavLink>
                    {isMobile && (
                        <div className="mobile-search-signin">
                            <div className="search-container">
                                <input type="search" placeholder="Search for leagues, teams, players, and news" className="search-bar" />
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            </div>
                        </div>
                    )}
                </nav>
                {!isMobile && (
                    <div className="desktop-search-signin">
                        <div className="search-container">
                            <input type="search" placeholder="Search for leagues, teams, players, and news" className="search-bar" />
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        </div>
                    </div>
                )}
            </div>
            {isSidebarOpen && <div className="backdrop" onClick={toggleSidebar} />}
        </header>
    );
};

export default Header;
