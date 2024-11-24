import React, { useState, useEffect } from 'react';
import '../../components/styles.css'; // Ensure this includes the provided CSS
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
            <section className="hero">
                <div className="hero-content">
                    <h2 className="abc">Welcome to ClinicCare</h2>
                    <p>Your Health, Our Priority</p>
                    {renderButton()} {/* Render the button based on the cuser role */}
                </div>
            </section>

           

            {/* Features Section */}
            <section id="service" className="features">
                <div
                    className={`feature-card ${visibleCards.includes('card1') ? 'visible from-left' : ''}`}
                    id="card1"
                >
                    <h3>Appointment Booking</h3>
                    <p>Easy online booking system for patients.</p>
                </div>
                <div
                    className={`feature-card ${visibleCards.includes('card2') ? 'visible from-right' : ''}`}
                    id="card2"
                >
                    <h3>Prescription Management</h3>
                    <p>Download prescriptions and track your treatment.</p>
                </div>
                <div
                    className={`feature-card ${visibleCards.includes('card3') ? 'visible from-left' : ''}`}
                    id="card3"
                >
                    <h3>Patient History</h3>
                    <p>Maintain an accurate record of your health journey.</p>
                </div>
                <div
                    className={`feature-card ${visibleCards.includes('card5') ? 'visible from-left' : ''}`}
                    id="card5"
                >
                    <h3>Real-Time Notifications</h3>
                    <p>Receive updates about appointments, test results, and more directly on your device.</p>
                </div>
            </section>
            <VideoCarousel />
            <br/><br/>
        </div>
    );
};

export default Home;
