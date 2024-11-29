import React, { useEffect, useState } from 'react';
import '../../components/profile.css'
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    from1: '',
    to1: '',
    from2: '',
    to2: '',
    workingDays: []
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        if (parsedUser.role === 'DOCTOR' && parsedUser.doctorProfile) {
          const doctorProfile = parsedUser.doctorProfile;
          setFormData({
            from1: doctorProfile.from1 || '',
            to1: doctorProfile.to1 || '',
            from2: doctorProfile.from2 || '',
            to2: doctorProfile.to2 || '',
            workingDays: doctorProfile.workingDays || []
          });
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleWorkingDaysChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      workingDays: checked
        ? [...prevState.workingDays, value]
        : prevState.workingDays.filter(day => day !== value)
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    // Prepare data to be sent in the POST request
    const updatedData = {
      id: user._id, // Assuming the user object has an _id field
      firstname: user.doctorProfile.firstname,
      lastname: user.doctorProfile.lastname,
      imr:user.doctorProfile.imr,
      phone: user.doctorProfile.phone,
      address: user.doctorProfile.address,
      specialization: user.doctorProfile.specialization,
      experience: user.doctorProfile.experience,
      feeperconsultation: formData.feeperconsultation,
      from1: formData.from1,
      to1: formData.to1,
      from2: formData.from2,
      to2: formData.to2,
      workingDays: formData.workingDays
    };

    try {
      // Sending the updated data to the server via POST
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/applye`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (response.ok) {
        // If the request is successful, update the user data in state and localStorage
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        setIsEditing(false); // Exit editing mode
        alert(result.message); // Show success message
      } else {
        // If the request failed, show an error message
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving doctor profile:', error);
      alert('An unexpected error occurred.');
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero to single digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-indexed
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  return (
    <>
      <br /><br /><br /><br /><br /><br />
      <div className="user-profile-container">
        <div className="user-profile-wrapper">
          <h1 className="user-profile-header">Profile</h1>
  
          <div className="user-profile-details">
            <div className="profile-row">
              <p><strong className="user-profile-label">Name:</strong> {user.username}</p>
            </div>
            <div className="profile-row">
              <p><strong className="user-profile-label">Email:</strong> {user.email}</p>
            </div>
            <div className="profile-row">
              <p><strong className="user-profile-label">Role:</strong> {user.role}</p>
            </div>
            <div className="profile-row">
          
              <p><strong className="user-profile-label">Joined On:</strong> {formatDate(user.createdAt)}</p>

            </div>
            {user.updatedAt && (
              <div className="profile-row">
                <p><strong className="user-profile-label">Last Updated:</strong> {formatDate(user.updatedAt)}</p>

              </div>
            )}
          </div>
  
          {user.role === 'DOCTOR' && user.doctorProfile && (
            <div className="doctor-profile-section">
              <h3 className="doctor-profile-header">Doctor Profile</h3>
              <div className="doctor-profile-mixed">
                <div className="doctor-profile-column">
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">First Name:</strong> {user.doctorProfile.firstname}</p>
                  </div>
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">Last Name:</strong> {user.doctorProfile.lastname}</p>
                  </div>
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">Specialization:</strong> {user.doctorProfile.specialization}</p>
                  </div>
                </div>
  
                <div className="doctor-profile-column">
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">Experience:</strong> {user.doctorProfile.experience}</p>
                  </div>
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">Fee per Consultation:</strong> {user.doctorProfile.feeperconsultation}</p>
                  </div>
                </div>
              </div>
  
              {isEditing ? (
                <>
                  <div className="time-input-section">
                    <div className="time-input-group">
                      <div className="time-input-field-wrapper">
                        <label htmlFor="from1" className="time-input-label">From 1 (Opening Time):</label>
                        <input 
                          type="time" 
                          name="from1" 
                          id="from1" 
                          value={formData.from1} 
                          onChange={handleTimeChange} 
                          className="time-input-field"
                        />
                      </div>
  
                      <div className="time-input-field-wrapper">
                        <label htmlFor="to1" className="time-input-label">To 1 (Closing Time):</label>
                        <input 
                          type="time" 
                          name="to1" 
                          id="to1" 
                          value={formData.to1} 
                          onChange={handleTimeChange} 
                          className="time-input-field"
                        />
                      </div>
                    </div>
                  </div>
  
                  {formData.from2 && formData.to2 && (
                    <>
                      <div className="time-input-section">
                        <div className="time-input-group">
                          <div className="time-input-field-wrapper">
                            <label htmlFor="from2" className="time-input-label">From 2 (Second Opening Time):</label>
                            <input 
                              type="time" 
                              name="from2" 
                              id="from2" 
                              value={formData.from2} 
                              onChange={handleTimeChange} 
                              className="time-input-field"
                            />
                          </div>
  
                          <div className="time-input-field-wrapper">
                            <label htmlFor="to2" className="time-input-label">To 2 (Second Closing Time):</label>
                            <input 
                              type="time" 
                              name="to2" 
                              id="to2" 
                              value={formData.to2} 
                              onChange={handleTimeChange} 
                              className="time-input-field"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
  
                  <div className="working-days-section">
                    <label className="working-days-label">Working Days:</label>
                    <div className="working-days-list">
                      {['0', '1', '2', '3', '4', '5', '6'].map((day) => (
                        <label key={day} className="working-day-option">
                          <input
                            type="checkbox"
                            value={day}
                            checked={formData.workingDays.includes(day)}
                            onChange={handleWorkingDaysChange}
                            className="working-day-checkbox"
                          />
                          {day === '0' ? 'Sunday' :
                           day === '1' ? 'Monday' :
                           day === '2' ? 'Tuesday' :
                           day === '3' ? 'Wednesday' :
                           day === '4' ? 'Thursday' :
                           day === '5' ? 'Friday' :
                           day === '6' ? 'Saturday' : ''}
                        </label>
                      ))}
                    </div>
                  </div>
  
                  <button onClick={handleSaveClick} className="save-button">Save</button>
                </>
              ) : (
                <>
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">From 1 (Opening Time):</strong> {user.doctorProfile.from1}</p>
                  </div>
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">To 1 (Closing Time):</strong> {user.doctorProfile.to1}</p>
                  </div>
                  {user.doctorProfile.from2 && user.doctorProfile.to2 && (
                    <>
                      <div className="profile-row">
                        <p><strong className="doctor-profile-label">From 2 (Second Opening Time):</strong> {user.doctorProfile.from2}</p>
                      </div>
                      <div className="profile-row">
                        <p><strong className="doctor-profile-label">To 2 (Second Closing Time):</strong> {user.doctorProfile.to2}</p>
                      </div>
                    </>
                  )}
                  <div className="profile-row">
                    <p><strong className="doctor-profile-label">Working Days:</strong> 
                      {user.doctorProfile.workingDays
                        .map(day => 
                          day === '0' ? 'Sunday' :
                          day === '1' ? 'Monday' :
                          day === '2' ? 'Tuesday' :
                          day === '3' ? 'Wednesday' :
                          day === '4' ? 'Thursday' :
                          day === '5' ? 'Friday' :
                          day === '6' ? 'Saturday' : ''
                        )
                        .join(', ')}
                    </p>
                  </div>
  
                  <button onClick={handleEditClick} className="edit-button">Edit</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <br /><br /><br /><br />
    </>
  );
  
  
  
  
};

export default Profile;
