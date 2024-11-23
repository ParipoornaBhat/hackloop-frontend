import React, { useEffect, useState } from 'react';

const Theme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        } else {
            setIsDarkMode(false);
            document.body.classList.remove('dark-mode');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    };

    return (
        <div className="mode-toggle-container" id="mode-toggle">
            <label className="switch">
                <input type="checkbox" id="theme-toggle" checked={isDarkMode} onChange={toggleTheme} />
                <span className="slider"></span>
            </label>
        </div>
    );
};

export default Theme;
