import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isNavActive, setIsNavActive] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [mouseAtTop, setMouseAtTop] = useState(false);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : null;

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (mouseAtTop) return;
            if (currentScroll > 50 && currentScroll > scrollPosition && isNavbarVisible) {
                setIsNavbarVisible(false);
            } else if (currentScroll <= 0 || currentScroll < scrollPosition) {
                setIsNavbarVisible(true);
            }
            setScrollPosition(currentScroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollPosition, isNavbarVisible, mouseAtTop]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY <= 10) {
                setMouseAtTop(true);
                setIsNavbarVisible(true);
            } else {
                setMouseAtTop(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const toggleNav = () => {
        setIsNavActive(!isNavActive);
    };

    const handleLogout = async (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Remove user data as well
        navigate("/auth/login");
    };

    return (
        <nav className={`navbar ${isNavbarVisible ? '' : 'hidden'}`} id="navbar">
        <Link to="/">
          <div className="logo-container">
            <img
              src="/logo2.png" // Path to your logo image (from the public folder)
              alt="Logo"
              className="logo-image"
            />
            <div className="logo-text">
              
              <h3 className="team-name">ClinicCare</h3>
            </div>
          </div>
        </Link>
        <div className="hamburger" onClick={toggleNav} id="hamburger">
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        <ul className={`nav-links ${isNavActive ? 'active' : ''}`} id="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="/#service">Services</a></li>
      
          {token ? (
            <>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/notify">Notification</a></li>
              {userRole === 'PATIENT' && <li><a href="/book">Book Appointment</a></li>}
              {userRole === 'PATIENT' && <li><a href="/appmanage">Manage Appointment</a></li>}
              {userRole === 'DOCTOR' && <li><a href="/appmanage">Manage Appointment</a></li>}
              {userRole === 'PATIENT' && <li><a href="/prescriptions">Prescriptions</a></li>}
              {userRole === 'PATIENT' && <li><a href="/apply">Apply Doctor</a></li>}
              {userRole === 'ADMIN' && <li><a href="/user/manage">Admin Dashboard</a></li>}
              <li><a href="#" onClick={handleLogout}>Logout</a></li>
            </>
          ) : (
            <>
              <li><Link to="/auth/login">Login</Link></li>
              
            </>
          )}
        </ul>
      </nav>
      
      
      
    );
};

export default Navbar;
