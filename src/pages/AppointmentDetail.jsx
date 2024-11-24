import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../components/appdetail.css';

const AppointmentDetail = () => {
  const cuser = JSON.parse(localStorage.getItem('user')); // Get current user from localStorage
  const { apid } = useParams();  // Get the appointment ID from the URL
  const [appointmentDetails, setAppointmentDetails] = useState({
    prescriptions: []  // Default empty array for prescriptions
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [notification, setNotification] = useState(''); // Notification state

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dappointment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apid }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointment details');
        }

        const data = await response.json();
        setAppointmentDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [apid]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!appointmentDetails) {
    return <div className="no-appointment">No appointment details available.</div>;
  }

  const handleConfirm = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${apid}/confirm`, { method: 'POST' });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Appointment confirmed');
          setAppointmentDetails(prev => ({ ...prev, status: 'confirmed' }));
          setNotification('Appointment has been confirmed.');
        } else {
          alert('Failed to confirm appointment: ' + data.message);
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

  return (<><br/><br/><br/>
    <div className="appointment-details-container">
      <div className="appointment-card">
        <h1 className="heading-large">Appointment Details</h1>

        <div className="appointment-info">
          <div className="info-row">
            <p><strong>Appointment ID:</strong> {appointmentDetails._id}</p>
            <p><strong>Patient:</strong> {appointmentDetails.patient ? appointmentDetails.patient.username : 'Unknown'}</p>
          </div>
          <div className="info-row">
            <p><strong>Doctor:</strong> {appointmentDetails.doctor ? 'Dr. ' + appointmentDetails.doctor.doctorProfile.firstname + ' ' + appointmentDetails.doctor.doctorProfile.lastname : 'Unknown'}</p>
            <p><strong>Appointment Date:</strong> {new Date(appointmentDetails.appointmentDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Time Slot Section */}
        {appointmentDetails.timeSlot && (
          <div className="time-slot-section">
            <h3 className="heading-medium">Time Slot</h3>
            <div className="info-row">
              <p><strong>Time:</strong> {appointmentDetails.timeSlot.time}</p>
              <p><strong>Start Time:</strong> {new Date(appointmentDetails.timeSlot.startTime).toLocaleString()}</p>
            </div>
            <div className="info-row">
              <p><strong>End Time:</strong> {new Date(appointmentDetails.timeSlot.endTime).toLocaleString()}</p>
              <p><strong>Available:</strong> {appointmentDetails.timeSlot.available ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="description-section">
          <h3 className="heading-medium">Description</h3>
          <p>{appointmentDetails.description || 'No description available'}</p>
        </div>

        {/* Previous Prescriptions Section */}
        {appointmentDetails.previousPrescriptions && appointmentDetails.previousPrescriptions.length > 0 ? (
          <div className="prescription-section">
            <h3 className="heading-medium">Previous Prescriptions</h3>
            {appointmentDetails.previousPrescriptions.map((prescription, index) => (
              <div key={index} className="prescription-item">
                <h4 className="heading-small">Diagnosis: {prescription.diagnosis || 'No diagnosis available'}</h4>
                {prescription.medications && prescription.medications.length > 0 && (
                  <div className="medication-list">
                    {prescription.medications.map((med, idx) => (
                      <div key={idx} className="medication-detail">
                        <p><strong>Medication:</strong> {med.name}</p>
                        <p><strong>Dosage:</strong> {med.dosage}</p>
                        <p><strong>Instructions:</strong> {med.instructions}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No previous prescriptions available.</p>
        )}

        {/* Current Prescription Section */}
        {appointmentDetails.status === 'completed' && appointmentDetails.prescription && (
          <div className="prescription-section">
            <h3 className="heading-medium">Current Prescription</h3>
            <p><strong>Diagnosis:</strong> {appointmentDetails.prescription.diagnosis || 'No diagnosis available'}</p>
            {appointmentDetails.prescription.medication && appointmentDetails.prescription.medication.length > 0 && (
              <div className="medication-list">
                {appointmentDetails.prescription.medication.map((med, index) => (
                  <div key={index} className="medication-detail">
                    <p><strong>Medication:</strong> {med.name}</p>
                    <p><strong>Dosage:</strong> {med.dosage}</p>
                    <p><strong>Instructions:</strong> {med.instructions}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status Section */}
        <div className="status-section">
          <p><strong>Status:</strong> {appointmentDetails.status}</p>
        </div>

        {/* Actions */}
        {cuser.role === 'DOCTOR' && appointmentDetails.status === 'requested' && (
          <div className="action-buttons">
            <button onClick={handleConfirm} className="btn-confirm">Confirm</button>
            <button onClick={handleCancel} className="btn-cancel">Cancel</button>
          </div>
        )}
      </div>
    </div><br/><br/><br/></>
  );
};

export default AppointmentDetail;
