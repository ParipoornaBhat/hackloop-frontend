import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../components/appdetail.css';

const AppointmentDetail = () => {
  const cuser = JSON.parse(localStorage.getItem('user')); // Get current user from localStorage
  const { apid } = useParams();  // Get the appointment ID from the URL
  const [appointmentDetails, setAppointmentDetails] = useState({
    prescriptions: []  // Default empty array for prescriptions
  }); // State to hold appointment details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [notification, setNotification] = useState(''); // Notification state
  const [newPrescription, setNewPrescription] = useState({ 
    medications: [{ name: '', dosage: '', instructions: '' }], // State for new prescription form (medications array)
    diagnosis: ''  // Diagnosis state
  });

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
    return <div className="appointment-loading">Loading...</div>;
  }

  if (error) {
    return <div className="appointment-error">{error}</div>;
  }

  if (!appointmentDetails) {
    return <div className="appointment-no-appointment">No appointment details available.</div>;
  }

  // Handle Confirm and Cancel actions
  const handleConfirm = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${apid}/confirm`, { method: 'POST' });
  
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

  // Handle new prescription submission and complete appointment
  const handleAddPrescription = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/completeAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apid,
          medication: newPrescription.medications, // Send the medications array with name, dosage, and instructions
          diagnosis: newPrescription.diagnosis,  // Diagnosis
          doctorId: appointmentDetails.doctor._id,
          patientId: appointmentDetails.patient._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Prescription added and appointment completed.');
        setAppointmentDetails(prev => ({
          ...prev,
          status: 'completed',
          prescription: data._id,  // Save the new prescription
          previousPrescriptions: [...prev.previousPrescriptions, data]  // Add to previous prescriptions
        }));
      } else {
        alert('Failed to complete appointment and add prescription');
      }
    } catch (error) {
      alert('Error completing appointment');
    }
  };

  // Handle changes to medication form
  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...newPrescription.medications];
    updatedMedications[index][field] = value;
    setNewPrescription({ ...newPrescription, medications: updatedMedications });
  };

  // Add new medication row
  const handleAddMedication = () => {
    setNewPrescription({ 
      ...newPrescription, 
      medications: [...newPrescription.medications, { name: '', dosage: '', instructions: '' }] 
    });
  };

  // Remove medication row
  const handleRemoveMedication = (index) => {
    const updatedMedications = newPrescription.medications.filter((_, i) => i !== index);
    setNewPrescription({ ...newPrescription, medications: updatedMedications });
  };

  return (
    <>
      <div className="appointment-detail-card">
        <h1 className="appointment-title">Appointment Details</h1>
        <p><strong>Appointment ID:</strong> {appointmentDetails._id}</p>

        {/* Display patient details */}
        {appointmentDetails.patient && (
          <p><strong>Patient:</strong> {appointmentDetails.patient.username || 'Unknown'}</p>
        )}

        {/* Display doctor details */}
        {appointmentDetails.doctor && (
          <p><strong>Doctor:</strong> {'Dr.' + appointmentDetails.doctor.doctorProfile.firstname + ' ' + appointmentDetails.doctor.doctorProfile.lastname || 'Unknown'}</p>
        )}

        {/* Appointment Date */}
        <p><strong>Appointment Date:</strong> {new Date(appointmentDetails.appointmentDate).toLocaleDateString()}</p>

        {/* Time Slot */}
        {appointmentDetails.timeSlot && (
          <div className="appointment-time-slot">
            <h3>Time Slot</h3>
            <p><strong>Time:</strong> {appointmentDetails.timeSlot.time}</p>
            <p><strong>Start Time:</strong> {new Date(appointmentDetails.timeSlot.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(appointmentDetails.timeSlot.endTime).toLocaleString()}</p>
            <p><strong>Available:</strong> {appointmentDetails.timeSlot.available ? 'Yes' : 'No'}</p>
          </div>
        )}

        {/* Description */}
        {appointmentDetails.description ? (
          <div className="appointment-description">
            <h3>Description: </h3>
            <p>{appointmentDetails.description}</p>
          </div>
        ) : (
          <div className="appointment-description">
            <h3>Description: </h3>
            <p>No description available</p>
          </div>
        )}

        {/* Previous Prescriptions */}
        <div className="appointment-prescription-details">
          <h3>Previous Prescriptions</h3>
          {appointmentDetails.previousPrescriptions && appointmentDetails.previousPrescriptions.length > 0 ? (
            appointmentDetails.previousPrescriptions.map((prescription, index) => (
              <div key={index}>
                <p><strong>Diagnosis:</strong> {prescription.diagnosis || 'No diagnosis available'}</p>
                {Array.isArray(prescription.medications) && prescription.medications.length > 0 ? (
                  <div>
                    <h4>Medications:</h4>
                    {prescription.medications.map((med, index) => (
                      <div key={index}>
                        <p><strong>Medication:</strong> {med.name}</p>
                        <p><strong>Dosage:</strong> {med.dosage}</p>
                        <p><strong>Instructions:</strong> {med.instructions}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No medications available for this prescription.</p>
                )}
              </div>
            ))
          ) : (
            <div>No previous prescriptions available.</div>
          )}
        </div>

        {/* Status */}
        <p><strong>Status:</strong> {appointmentDetails.status}</p>

        {/* Confirm and Cancel buttons for Doctor */}
        {cuser.role === 'DOCTOR' && appointmentDetails.status === 'requested' && (
          <div className="appointment-actions">
            <button onClick={handleConfirm} className="appointment-confirm-button">Confirm</button>
            <button onClick={handleCancel} className="appointment-cancel-button">Cancel</button>
          </div>
        )}

        {/* Prescription form for Doctor */}
        {cuser.role === 'DOCTOR' && appointmentDetails.status === 'confirmed' && (
          <div className="appointment-prescription-form">
            <h3>Add Prescription</h3>
            <div className="appointment-diagnosis">
              <label>Diagnosis:</label>
              <input 
                type="text" 
                value={newPrescription.diagnosis} 
                onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })} 
                placeholder="Diagnosis" 
              />
            </div>
            <div className="appointment-medications">
              <h4>Medications</h4>
              {newPrescription.medications.map((med, index) => (
                <div key={index} className="appointment-medication-row">
                  <input 
                    type="text" 
                    value={med.name} 
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} 
                    placeholder="Medication Name" 
                  />
                  <input 
                    type="text" 
                    value={med.dosage} 
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} 
                    placeholder="Dosage" 
                  />
                  <input 
                    type="text" 
                    value={med.instructions} 
                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)} 
                    placeholder="Instructions" 
                  />
                  <button type="button" onClick={() => handleRemoveMedication(index)} className="appointment-remove-medication-button">Remove</button>
                </div>
              ))}
              <button type="button" onClick={handleAddMedication} className="appointment-add-medication-button">Add Medication</button>
            </div>
            <button onClick={handleAddPrescription} className="appointment-add-prescription-button">Complete Appointment & Add Prescription</button>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentDetail;
