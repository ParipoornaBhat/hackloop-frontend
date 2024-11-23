import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../components/logins.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  
  // Handle sending OTP
  const sendOtp = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otpf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
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
    if (otp === generatedOtp) {
      setOtpVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid OTP');
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

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

    if (password !== newConfirmPassword) {
      setPasswordError('Passwords do not match');
    } else if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordError || password !== confirmPassword || password.length < 6) {
      setPasswordError('Password validation failed');
      return;
    }

    const formData = { email, password };
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/get-form-data-forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
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
          <h2>Forgot Password</h2>
          <div className="input-field">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="button" onClick={sendOtp}>
            Send OTP
          </button>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          {isOtpSent && (
            <div className="input-field">
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {isOtpSent && (
            <button type="button" onClick={verifyOtp}>
              Verify OTP
            </button>
          )}

          {otpVerified && (
            <>
              <div className="input-field">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="input-field">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
                
              {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
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
              <button type="submit">Reset Password</button>
            </>
          )}

          <p>
            <a href="/auth/login">Back to Log In</a>
          </p>
        </form>
      </div>
      
    </div><br/></>
  );
};

export default LoginPage;
