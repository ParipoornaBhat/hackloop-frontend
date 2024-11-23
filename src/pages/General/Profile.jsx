import React, { useEffect, useState } from 'react';

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
      const response = await fetch('/api/user/applye', {
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

  return (<><br /><br /><br /><br /><br /><br />
    <div className="frm">
      <div className="wrapper">
      
      <h1>Profile</h1>

      <div className="profile-details">
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Joined On:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        {user.updatedAt && (
          <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
        )}
      </div>

      {user.role === 'DOCTOR' && user.doctorProfile && (
        <div className="doctor-profile-details">
          <h3>Doctor Profile</h3>
          <p><strong>First Name:</strong> {user.doctorProfile.firstname}</p>
          <p><strong>Last Name:</strong> {user.doctorProfile.lastname}</p>
          <p><strong>Specialization:</strong> {user.doctorProfile.specialization}</p>
          <p><strong>experience:</strong> {user.doctorProfile.experience}</p>

          <p><strong>Fee per Consultation:</strong> {user.doctorProfile.feeperconsultation}</p>

          {isEditing ? (
            <>
              <div>
                <label>From 1 (Opening Time):</label>
                <input 
                  type="time" 
                  name="from1" 
                  value={formData.from1} 
                  onChange={handleTimeChange} 
                />
              </div>

              <div>
                <label>To 1 (Closing Time):</label>
                <input 
                  type="time" 
                  name="to1" 
                  value={formData.to1} 
                  onChange={handleTimeChange} 
                />
              </div>

              {formData.from2 && formData.to2 && (
                <>
                  <div>
                    <label>From 2 (Second Opening Time):</label>
                    <input 
                      type="time" 
                      name="from2" 
                      value={formData.from2} 
                      onChange={handleTimeChange} 
                    />
                  </div>

                  <div>
                    <label>To 2 (Second Closing Time):</label>
                    <input 
                      type="time" 
                      name="to2" 
                      value={formData.to2} 
                      onChange={handleTimeChange} 
                    />
                  </div>
                </>
              )}

<div>
  <label>Working Days:</label>
  {['0', '1', '2', '3', '4', '5', '6'].map((day) => (
    <label key={day}>
      <input
        type="checkbox"
        value={day}
        checked={formData.workingDays.includes(day)}
        onChange={handleWorkingDaysChange}
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
              <button onClick={handleSaveClick}>Save</button>
            </>
          ) : (
            <>
              <p><strong>From 1 (Opening Time):</strong> {user.doctorProfile.from1}</p>
              <p><strong>To 1 (Closing Time):</strong> {user.doctorProfile.to1}</p>
              {user.doctorProfile.from2 && user.doctorProfile.to2 && (
                <>
                  <p><strong>From 2 (Second Opening Time):</strong> {user.doctorProfile.from2}</p>
                  <p><strong>To 2 (Second Closing Time):</strong> {user.doctorProfile.to2}</p>
                </>
              )}
<p><strong>Working Days:</strong> 
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

              <button onClick={handleEditClick}>Edit</button>
            </>
          )}
        </div>
      )}
    </div></div><br /><br /><br /><br /></>
  );
};

export default Profile;
