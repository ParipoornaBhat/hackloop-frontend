import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../components/apply.css';  // Add your styles

const Apply = () => {
  const navigate = useNavigate();  

  const [cuser, setUser] = useState(null); // State to store user data
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showSecondShift, setShowSecondShift] = useState(false);  // State to toggle second shift visibility
  const [workingDays, setWorkingDays] = useState([]);  // State to store selected working days

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  // Handle phone number input change and validation
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);

    // Check if the phone number is exactly 10 digits
    if (phoneValue.length !== 10) {
      setPhoneError('Phone number must be 10 digits.');
    } else {
      setPhoneError('');
    }
  };

  // Handle the change in working days selection
  const handleWorkingDaysChange = (e) => {
    const { value, checked } = e.target;
    setWorkingDays(prevState => 
      checked ? [...prevState, value] : prevState.filter(day => day !== value)
    );
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Use FormData to gather form values

    // Prepare data for POST request
    const data = {
      id: formData.get('id'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      imr: formData.get('imr'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      specialization:formData.get('specialization'),
      experience: formData.get('experience'),
      feeperconsultation: formData.get('feeperconsultation'),
      from1: formData.get('from1'),
      to1: formData.get('to1'),
      from2: formData.get('from2'),  // Include second shift from
      to2: formData.get('to2'),      // Include second shift to
      workingDays: workingDays,      // Include the selected working days
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send data as JSON in the body
      });
    
      const result = await response.json();
      if (result.success) {
        // Success - Update user data and localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'));
        currentUser.isDoctorRequested = true; // Set the isDoctorRequested field to true
        currentUser.doctorProfile=result.user;
        localStorage.setItem('user', JSON.stringify(currentUser));
  
        // Wait for a moment to ensure localStorage is updated before reloading
        setTimeout(() => {
          window.location.reload(); // Reload the page after success
        }, 500); // 500ms delay (you can adjust this as needed)
  
      }
    } catch (error) {
      console.log('Error during registration:', error);
    }
  };

  // Wait for `cuser` to be loaded before rendering the form
  if (!cuser) {
    return (<div><br/><br/><br/><br/>Loading...</div>); // Loading message until user data is fetched
  }

  return (
    <>
      <br /><br />
      <div className="frm">
        <div className="wrapper2">
          {/* Check if the doctor application is already submitted */}
          {cuser.isDoctorRequested ? (
            <h1>Your doctor application has been successfully submitted!</h1>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>Doctor Application</h2>
              {/* Use the cuser._id to set the id field */}
              <input type="hidden" name="id" value={cuser._id} />

              <div className="input-field">
                <input
                  type="text"
                  placeholder=""
                  name="firstname"
                  id="input-firstname"
                  required
                />
                <label>Enter your First Name</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  placeholder=""
                  name="lastname"
                  id="input-lastname"
                  required
                />
                <label>Enter your Last Name</label>
              </div>
              
              <div className="input-field">
                <input
                  type="text"
                  placeholder=""
                  name="imr"
                  id="input-imr"
                  required
                />
                <label>Enter your IMR No.</label>
              </div>

              <div className="input-field">
                <input
                  type="number"
                  placeholder=""
                  name="phone"
                  id="input-phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  maxLength="10"
                />
                <span className="invalid" id="phone-error">{phoneError}</span>
                <label>Enter your phone number</label>
              </div>

              <div className="textarea-field">
                <textarea
                  placeholder=""
                  name="address"
                  id="textarea-address"
                  required
                  rows="8"
                  cols="10"
                />
                <label>Enter your Address</label>
              </div>

              <label htmlFor="specialization">Select Doctor Specialization:</label>
              <div className="input-field">
                <select id="specialization" name="specialization" required>
                  <option value="" disabled selected>Select a specialization</option>
                  <option value="cardiologist">Cardiologist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="neurologist">Neurologist</option>
                  <option value="pediatrician">Pediatrician</option>
                  <option value="orthopedist">Orthopedist</option>
                  <option value="gastroenterologist">Gastroenterologist</option>
                  <option value="psychiatrist">Psychiatrist</option>
                  <option value="dentist">Dentist</option>
                  <option value="radiologist">Radiologist</option>
                  <option value="gynecologist">Gynecologist</option>
                  <option value="urologist">Urologist</option>
                  <option value="surgeon">Surgeon</option>
                  <option value="endocrinologist">Endocrinologist</option>
                  <option value="oncologist">Oncologist</option>
                </select>
              </div>

              <div className="input-field">
                <input
                  type="number"
                  placeholder=""
                  name="experience"
                  id="input-experience"
                  required
                />
                <label>Enter your Experience</label>
              </div>

              <div className="input-field">
                <input
                  type="number"
                  placeholder=""
                  name="feeperconsultation"
                  id="input-feeperconsultation"
                  required
                />
                <label>Enter Fee Per Consultation</label>
              </div>

              <div className="time-input-field">
                <input
                  type="time"
                  placeholder=""
                  name="from1"
                  id="input-from1"
                  required
                />
                <label>Opening Hour</label>
              </div>

              <div className="time-input-field">
                <input
                  type="time"
                  placeholder=""
                  name="to1"
                  id="input-to1"
                  required
                />
                <label>Ending Hour</label>
              </div>

              {/* Checkbox to toggle second shift */}
              <div className="forget">
                <label>
                  <input
                    type="checkbox"
                    checked={showSecondShift}
                    onChange={() => setShowSecondShift(!showSecondShift)} // Toggle the state
                  />
                  Add 2nd Shift Hours
                </label>
              </div>

              {/* Conditionally render second shift time fields */}
              {showSecondShift && (
                <>
                  <h3>2nd Shift:</h3>
                  <div className="time-input-field">
                    <input
                      type="time"
                      placeholder=""
                      name="from2"
                      id="input-from2"
                      required
                    />
                    <label>Opening Hour</label>
                  </div>

                  <div className="time-input-field">
                    <input
                      type="time"
                      placeholder=""
                      name="to2"
                      id="input-to2"
                      required
                    />
                    <label>Ending Hour</label>
                  </div>
                </>
              )}

              {/* Working Days Selection */}
              <div className="working-days">
                <h3>Select Working Days:</h3>
                <label>
                  <input
                    type="checkbox"
                    value="1"
                    onChange={handleWorkingDaysChange}
                  />
                  Monday
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="2"
                    onChange={handleWorkingDaysChange}
                  />
                  Tuesday
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="3"
                    onChange={handleWorkingDaysChange}
                  />
                  Wednesday
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="4"
                    onChange={handleWorkingDaysChange}
                  />
                  Thursday
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="5"
                    onChange={handleWorkingDaysChange}
                  />
                  Friday
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="6"
                    onChange={handleWorkingDaysChange}
                  />
                  Saturday
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="0"
                    onChange={handleWorkingDaysChange}
                  />
                  Sunday
                </label>
              </div>

              <br />
              <button type="submit" disabled={phoneError}>Apply</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Apply;
