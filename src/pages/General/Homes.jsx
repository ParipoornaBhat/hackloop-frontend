import React, { useState, useEffect } from 'react';
import '../../components/styles.css'; // Ensure this includes the updated CSS
import VideoCarousel from '../../layouts/Corousel';

const Home = () => {
    const cuser = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

    // State to track the current angle of the carousel
    const [currentAngle, setCurrentAngle] = useState(0);
    const [visibleCards, setVisibleCards] = useState([]);

    // Function to rotate the carousel by a given angle
    const rotateCarousel = (angle) => {
        setCurrentAngle(angle); // Update the angle state
    };

    // Previous button functionality
    const handlePrevClick = () => {
        rotateCarousel(currentAngle - 90); // Rotate 90 degrees counterclockwise
    };

    // Next button functionality
    const handleNextClick = () => {
        rotateCarousel(currentAngle + 90); // Rotate 90 degrees clockwise
    };

    // Auto-rotate the carousel every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentAngle((prevAngle) => prevAngle + 90); // Increment angle by 90 degrees
        }, 2000); // 2000ms = 2 seconds

        return () => {
            clearInterval(intervalId); // Cleanup interval on component unmount
        };
    }, []);

    // IntersectionObserver to detect when feature cards are in view
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add 'visible' class to feature card when it's in view
                    setVisibleCards((prev) => [...prev, entry.target.id]);

                    // Trigger typing animation and hide the cursor once completed
                    const typedText = entry.target.querySelector('.typed-text');
                    const typedDesc = entry.target.querySelector('.typed-desc');

                    if (typedText && !typedText.classList.contains('typing-complete')) {
                        typedText.classList.add('typing-complete'); // Hide cursor after typing
                    }

                    if (typedDesc && !typedDesc.classList.contains('typing-complete')) {
                        typedDesc.classList.add('typing-complete'); // Hide cursor after typing
                    }
                } else {
                    // Remove 'visible' class when the card is out of view
                    setVisibleCards((prev) => prev.filter((id) => id !== entry.target.id));
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the card is in view

        // Target all feature cards
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card) => observer.observe(card));

        return () => {
            // Clean up observer on component unmount
            observer.disconnect();
        };
    }, []);

    // Render different button based on cuser
    const renderButton = () => {
        if (!cuser) {
            // If no user is logged in, show Login button
            return (
                <a href="/auth/login" className="cta-btn">
                    Login
                </a>
            );
        }

        // If user exists, check the role and display the appropriate button
        switch (cuser.role) {
            case 'PATIENT':
                return (
                    <a href="/book" className="cta-btn">
                        Book an Appointment
                    </a>
                );
            case 'DOCTOR':
                return (
                    <a href="/appmanage" className="cta-btn">
                        Manage Appointment
                    </a>
                );
            case 'ADMIN':
                return (
                    <a href="/user/manage" className="cta-btn">
                        Manage Users
                    </a>
                );
            default:
                return null; // In case no matching role, return nothing
        }
    };

    return (
        <div>
            {/* Hero Section - Fixed at the top */}
            <section className="hero">
                <div className="hero-content">
                    <h2>Welcome to ClinicCare</h2>
                    <p>Your Health, Our Priority</p>
                    {renderButton()} {/* Render the button based on the cuser role */}
                </div>
            </section>

            {/* Main Content Section */}
            <div className="content">
                {/* Features Section */}
                <section id="service" className="feature-container">
                    <div
                        className={`feature-card left ${visibleCards.includes('card1') ? 'visible' : 'out-of-view'}`}
                        id="card1"
                    >
                        <span className="typed-text">Appointment Booking</span>
                        <br />
                        <span className="typed-desc">Easy online booking system for patients.</span>
                    </div><hr/>
                    <div
                        className={`feature-card right ${visibleCards.includes('card2') ? 'visible' : 'out-of-view'}`}
                        id="card2"
                    >
                        <span className="typed-text">Prescription Management</span>
                        <br />
                        <span className="typed-desc">Download prescriptions and track your treatment.</span>
                    </div><hr/>
                    <div
                        className={`feature-card right ${visibleCards.includes('card3') ? 'visible' : 'out-of-view'}`}
                        id="card3"
                    >
                        <span className="typed-text">Prescription Management</span>
                        <br />
                        <span className="typed-desc">Download prescriptions and track your treatment.</span>
                    </div><hr/>
                    <div
                        className={`feature-card right ${visibleCards.includes('card4') ? 'visible' : 'out-of-view'}`}
                        id="card4"
                    > 
                        <span className="typed-text">Patient History</span>
                        <br />
                        <span className="typed-desc">Maintain an accurate record of your health journey.</span>
                    </div><hr/>
                </section>

                {/* Video Carousel Section */}
                <VideoCarousel />
                <br /><br />
            </div>
        </div>
    );
};

export default Home;
