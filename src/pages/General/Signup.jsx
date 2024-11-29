import React, { useState } from 'react';
import '../../components/logins.css';
import { useNavigate } from 'react-router-dom'; 

const Signup = () => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  

  // Handle sending OTP
  const sendOtp = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();

    if (data.success) {
      setGeneratedOtp(data.otp);
      setIsOtpSent(true);
      setErrorMessage('');
    } else {
      setErrorMessage(data.message);
      setIsOtpSent(false);
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verifyotp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp })
    });
    const data = await response.json();

    if (data.success) {
      setOtpVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage(data.message);
    }
  };

  // Password matching and validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Password validation logic
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else if (newPassword.length < 6) {
      setPasswordError('Password should be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    // Password validation logic
    if (password !== newConfirmPassword) {
      setPasswordError('Passwords do not match');
    } else if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate passwords during form submission
    if (passwordError || password !== confirmPassword || password.length < 6) {
      setPasswordError('Password validation failed');
      return;
    }
    const formData = { user, email, password };
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/get-form-data-reg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();

    if (result.success) {
      alert(result.message);
      navigate('/auth/login'); 
      // Redirect to login or perform other actions
    } else {
      alert(result.message);
    }
  };

  return (<><br/><br/><br/><br/><br/>
    <div className="frm">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <div className="input-field">
            <input
              type="text"
              placeholder=""
              name="username"
              onChange={(e) => setUser(e.target.value)}
              required
            /><label>Enter your Username</label>
          </div>

          <div className="input-field">
            <input
              type="email"
              placeholder=""
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /><label>Enter your Email</label>
          </div>

          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>

          {isOtpSent && (
            <div>
              <div id="otpMessage" style={{ color: 'green' }}>OTP sent to your email!</div>
              <div className="input-field">
                <input
                  type="number"
                  placeholder=""
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                /><label>Enter The OTP</label>
              </div>
              <button type="button" onClick={verifyOtp}>Verify OTP</button>
            </div>
          )}

          <div id="otpv" style={{ color: errorMessage ? 'red' : 'green' }}>
            {errorMessage}
          </div>

          {otpVerified && (
            <>
              <div className="input-field">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder=""
                  name="pw"
                  value={password}
                  onChange={handlePasswordChange} // Use the onChange handler for password
                  required
                /><label>Enter your Password</label>
              </div>
              <div className="input-field">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder=""
                  value={confirmPassword}
                  name="cpw"
                  onChange={handleConfirmPasswordChange} // Use the onChange handler for confirm password
                  required
                /><label>Confirm your Password</label>
              </div>
              {passwordError && <div id="signup_err" style={{ color: 'red' }}>{passwordError}</div>}
              <div className="forget">
                <label htmlFor="password2">
                  <input
                    type="checkbox"
                    id="password2"
                    onChange={() => setPasswordVisible(!passwordVisible)}
                  />
                  <p>Show Password</p>
                </label>
              </div>
              <button type="submit" >Sign Up</button>
            </>
          )}

          <p>Already have an account? <a href="/auth/login">Log In</a></p>
        </form>
      </div>
    </div><br/></>
  );
};

export default Signup;
