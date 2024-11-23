import React, { useState } from 'react';
import '../../components/logins.css';  // Add your styles
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
  const navigate = useNavigate();  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [flashMessages, setFlashMessages] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      
      // Send POST request to the backend (via proxy in development)
      const response = await fetch('/api/auth/get-form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // If the login failed (status 400), capture and show flash messages
        const errorData = await response.json();
        if (errorData.flash) {
          setFlashMessages(errorData.flash); // Set flash messages from the backend response
        }
      } else {
        const data = await response.json(); // Parse the response data
        // Assuming the user object is returned in the response
        
        
        localStorage.setItem("token", data.token.token);
        localStorage.setItem("user", JSON.stringify(data.token.user));
    
        // Redirect or navigate to the profile page
        navigate('/profile'); 


      }
    } catch (error) {
      // Handle network errors or unexpected issues
      console.log(`Login failed:${error}`);
    }
  };

  return (<><br/><br/><br/><br/>
    <div className="frm">
      <div className="wrapper">
        {/* Display flash messages if any */}
        {flashMessages.length > 0 && (
          <div className="messages">
            <ul className="messages">
              {flashMessages.map((message, index) => (
                <li key={index} className="error">{message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          
          <div className="input-field">
            <input type="email" placeholder="Email" name="email" required />
            <label>Enter your email</label>
          </div>

          <div className="input-field">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              required
            />
            <label>Enter your password</label>
          </div>

          <div className="forget">
            <label htmlFor="password2">
              <input
                type="checkbox"
                id="password2"
                onChange={() => setPasswordVisible(!passwordVisible)}
              />
              <p>Show Password</p>
            </label>
            <a href="/auth/fp">Forgot password?</a>
          </div>

          <button type="submit">Log In</button>
          <div className="register">
            <p>Don't have an account? <a href="/auth/signup">Register</a></p>
          </div>
        </form>
      </div>
    </div><br/></>
  );
};

export default LoginPage;
