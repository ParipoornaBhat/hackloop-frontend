import React, { useState, useEffect } from 'react';
import '../components/apply.css';  // Import the new CSS file

const ManageUser = () => {

  const [cuser, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the user object from localStorage
    const userData = localStorage.getItem('user');
    
    // Check if userData exists and is a valid JSON string
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser); // Set the user data in state
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/user/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle form submission for updating user role
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
  
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const cid = formData.get('cid');
    const role = formData.get('role');
    
    const dataToSend = {
      id,
      cid,
      role,
    };
  
    try {
      const response = await fetch('/api/user/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Sending JSON directly
      });
  
      const data = await response.json();
  
      if (data.success) {
        setMessage(data.message || 'An error occurred success msg');
        // Re-fetch users to reflect the changes
        const fetchUsers = async () => {
          try {
            const response = await fetch('/api/user/users');
            const data = await response.json();
            setUsers(data); // Update users state with the latest data
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
        fetchUsers();
      } else {
        setMessage(data.message || 'An error occurred during the update');
      }
    } catch (error) {
      console.log('Error updating role:', error);
      setMessage('An error occurred while updating the role.');
    }
  };

  return (
    <div className="manage-user-container">
      <h1 className="manage-user-title">Manage Users</h1>
      {message && <p className="manage-user-message">{message}</p>}
      
      <div className="table-container">
      <div className="table-scroll-container">
 

        <table className="manage-user-table">
          <thead>
            <tr>
              <th>id</th>
              <th>email</th>
              <th>role</th>
              <th>requests</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  <a href={`/doctor/${user._id}`}>
                    {user.email}
                  </a>
                </td>
                <td>{user.role}</td>
                <td>
                  {user.role === 'DOCTOR' && <p className="green">APPROVED</p>}
                  {user.role !== 'DOCTOR' && user.isDoctorRequested && (
                    <p className="red">Requested</p>
                  )}
                  {user.role === 'PATIENT' && <p className="gray">Patient</p>}
                </td>
                <td>
                  <form onSubmit={handleFormSubmit}>
                    <input type="hidden" name="id" value={user._id} />
                    <input type="hidden" name="cid" value={cuser?._id} />
                    <select name="role" defaultValue={user.role}>
                      <option value="ADMIN">Admin</option>
                      <option value="DOCTOR">Doctor</option>
                      <option value="PATIENT">Patient</option>
                    </select>
                    <button type="submit">Update</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <br /><br /><br /><br /><br /><br />
    </div>
  );
};

export default ManageUser;
