import React, { useState } from 'react';
import '../../components/logins.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [currentOtp, setCurrentOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const navigate = useNavigate();

  // Handle sending OTP
  const sendOtp = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsOtpSent(true);
        setCurrentOtp(data.otp); // Store the OTP for verification
        setErrorMessage('');
      } else {
        setErrorMessage(data.message);
        setIsOtpSent(false);
      }
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again.');
    }
  };

  // Handle OTP verification
  const verifyOtp = async () => {
    try {
      if (otp !== currentOtp) {
        setOtpVerified(false);
        setErrorMessage('Invalid OTP. Please try again.');
        return;
      } else{
        setOtpVerified(true);
        setErrorMessage('Verified successfully!');
      }


     
    } catch (error) {
      setErrorMessage('OTP verification failed. Try again.');
    }
  };

  // Handle password validation on blur
  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters');
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Profile picture must be less than 5MB.');
        return;
      }
      setProfilePic(file);
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePic(null);
      setProfilePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordError || password !== confirmPassword || password.length < 6) {
      setPasswordError('Password validation failed');
      return;
    }

    const formData = new FormData();
    formData.append('username', user);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        navigate('/auth/login');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <br /><br /><br /><br /><br />
      <div className="frm">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <div className="input-field">
              <input
                type="text"
                name="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
              <label>Enter your Username</label>
            </div>

            <div className="input-field">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Enter your Email</label>
            </div>

            <button type="button" onClick={sendOtp}>Send OTP</button>

            {isOtpSent && (
              <div>
                <div id="otpMessage" style={{ color: 'green' }}>OTP sent to your email!</div>
                <div className="input-field">
                  <input
                    type="number"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <label>Enter The OTP</label>
                </div>
                <button type="button" onClick={verifyOtp}>Verify OTP</button>
              </div>
            )}

<p style={{ color: otpVerified ? 'green' : 'red' }}>
  {errorMessage}
</p>


            {otpVerified && (
              <>
                <div className="input-field">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="pw"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                    required
                  />
                  <label>Enter your Password</label>
                </div>
                <div className="input-field">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="cpw"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validatePassword}
                    required
                  />
                  <label>Confirm your Password</label>
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

                <div className="input-field">
                  <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                  <label>Upload Profile Picture</label>
                </div>

                {profilePreview && (
                  <div className="image-preview">
                    <img src={profilePreview} alt="Profile Preview" width="100" height="100" />
                  </div>
                )}

                <button type="submit" disabled={!otpVerified}>Sign Up</button>
              </>
            )}

            <p>Already have an account? <a href="/auth/login">Log In</a></p>
          </form>
        </div>
      </div>
      <br />
    </>
  );
};

export default Signup;
