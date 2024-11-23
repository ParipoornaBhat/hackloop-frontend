import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-4">Sorry, the page you are looking for doesn't exist.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-600">Go back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;



