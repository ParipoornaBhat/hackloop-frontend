import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../components/appdetail.css';

const AppointmentDetail = () => {
  const cuser = JSON.parse(localStorage.getItem('user')); // Get current user from localStorage

  const { apid } = useParams();  // Get the appointment ID from the URL
  const [appointmentDetails, setAppointmentDetails] = useState(null); // State to hold appointment details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [notification, setNotification] = useState(''); // Notification state

  // Fetch appointment details when component mounts or apid changes
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        setError(null);  // Reset any previous errors
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dappointment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apid }),  // Send apid in the request body
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointment details');
        }

        const data = await response.json();  // Parse the response data
        setAppointmentDetails(data); // Set the data into state
      } catch (err) {
        setError(err.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false after request is done
      }
    };

    fetchAppointmentDetails();
  }, [apid]);  // Dependency on apid so that it fetches details when apid changes

  // Render loading, error, or appointment details
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!appointmentDetails) {
    return <div className="no-appointment">No appointment details available.</div>;
  }

  // Handle Confirm and Cancel actions
  const handleConfirm = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${apid}/confirm`, { method: 'POST' });
  
      // Check if the response is successful (status 200)
      if (response.ok) {
        const data = await response.json();  // Parse the JSON response
        if (data.success) {  // Check if success is true
          alert('Appointment confirmed');
          setAppointmentDetails(prev => ({ ...prev, status: 'confirmed' }));
          setNotification('Appointment has been confirmed.');
        } else {
          alert('Failed to confirm appointment: ' + data.message);  // Show backend message if success is false
        }
      } else {
        alert('Failed to confirm appointment');
      }
    } catch (error) {
      alert('Error confirming appointment');
    }
  };
  

  const handleCancel = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${apid}/cancel`, { method: 'POST' });
      if (response.ok) {
        alert('Appointment cancelled');
        setAppointmentDetails(prev => ({ ...prev, status: 'cancelled' }));
        setNotification('Appointment has been cancelled.');
      } else {
        alert('Failed to cancel appointment');
      }
    } catch (error) {
      alert('Error cancelling appointment');
    }
  };

  return (
    <>
      <br /><br /><br /><br /><br />
      <div className="appointment-card">
        <h1>Appointment Details</h1>
        <p><strong>Appointment ID:</strong> {appointmentDetails._id}</p>

        {/* Display patient details */}
        {appointmentDetails.patient && (
          <p><strong>Patient:</strong> {appointmentDetails.patient.username || 'Unknown'}</p>
        )}

        {/* Display doctor details */}
        {appointmentDetails.doctor && (
          <p><strong>Doctor:</strong> {'Dr.'+appointmentDetails.doctor.doctorProfile.firstname+' '+appointmentDetails.doctor.doctorProfile.lastname || 'Unknown'}</p>
        )}

        {/* Appointment Date */}
        <p><strong>Appointment Date:</strong> {new Date(appointmentDetails.appointmentDate).toLocaleDateString()}</p>

        {/* Time Slot */}
        {appointmentDetails.timeSlot && (
          <div className="time-slot">
            <h3>Time Slot</h3>
            <p><strong>Time:</strong> {appointmentDetails.timeSlot.time}</p>
            <p><strong>Start Time:</strong> {new Date(appointmentDetails.timeSlot.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(appointmentDetails.timeSlot.endTime).toLocaleString()}</p>
            <p><strong>Available:</strong> {appointmentDetails.timeSlot.available ? 'Yes' : 'No'}</p>
          </div>
        )}

        {/* Description */}
        {appointmentDetails.description && (
          <div className="description">
            <h3>Description</h3>
            <p>{appointmentDetails.description}</p>
          </div>
        )}

        {/* Appointment Status */}
        <p><strong>Status:</strong> {appointmentDetails.status}</p>

        {/* Notification */}
        {notification && (
          <div className="notification">
            <p>{notification}</p>
          </div>
        )}

        {/* Show Confirm and Cancel buttons if user is a doctor */}
        {cuser.role === 'DOCTOR' && appointmentDetails.status === 'requested' && (
          <div className="appointment-actions">
            <button onClick={handleConfirm} className="btn-confirm">Confirm</button>
            <button onClick={handleCancel} className="btn-cancel">Cancel</button>
          </div>
        )}
      </div>
      <br />
    </>
  );
};

export default AppointmentDetail;
