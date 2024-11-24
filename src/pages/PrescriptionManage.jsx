import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/PrescriptionManage.css';

const PrescriptionManage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');
  const [cuser, setCuser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCuser(user);
    if (!user) {
      setError('No user found in localStorage');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id }),
    })
      .then((response) => response.json())
      .then((data) => setPrescriptions(data))
      .catch((err) => setError('Failed to fetch prescriptions'));
  }, []);

  const handlePrescriptionClick = (appointmentId) => {
    navigate(`/appointments/${appointmentId}`);
  };

  // Helper function to format date to show only the date part (e.g., "2024-12-02")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();  // "MM/DD/YYYY" format by default
  };

  return (<><br/><br/>
    <div className="prescription-manage-container">
      <div className="prescription-manage-card-wrapper">
        <h2 className="prescription-manage-heading">Prescription Management</h2>
        {error && <p className="prescription-manage-error">{error}</p>}

        <div className="prescription-card-container">
          {prescriptions.length === 0 ? (
            <p className="prescription-manage-no-prescriptions">No prescriptions found.</p>
          ) : (
            prescriptions.map((prescription) => {
              const { _id, doctor, appointment, medication, diagnosis } = prescription;

              return (
                <div
                  key={_id}
                  className="prescription-card"
                  onClick={() => handlePrescriptionClick(appointment._id)}
                >
                  <h3 className="prescription-card-title">
                    Prescription by Dr. {doctor.doctorProfile.firstname} {doctor.doctorProfile.lastname}
                  </h3>

                  {/* Display only the appointment date */}
                  <p className="prescription-card-text">
                    Appointment Date: {formatDate(appointment.appointmentDate)}
                  </p>

                  {/* Display timeslot time */}
                  {appointment.timeSlot && appointment.timeSlot.time && (
                    <p className="prescription-card-text">
                      Time Slot: {appointment.timeSlot.time}
                    </p>
                  )}

                  {/* Display diagnosis */}
                  {diagnosis && (
                    <p className="prescription-card-text">
                      Diagnosis: {diagnosis}
                    </p>
                  )}

                  <div className="prescription-card-medication-list">
                    <p className="prescription-card-text">Medication:</p>
                    {medication.length === 0 ? (
                      <p>No medication prescribed.</p>
                    ) : (
                      medication.map((med, index) => (
                        <div key={index} className="prescription-card-medication-item">
                          <span className="prescription-card-medication-name">{med.name}</span>
                          <span>{` - ${med.dosage} - ${med.instructions}`}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Display doctor details */}
                  <div className="prescription-card-doctor-info">
                    <p className="prescription-card-text">
                      <strong>Doctor Info:</strong><br />
                      Specialization: {doctor.doctorProfile.specialization}<br />
                      Experience: {doctor.doctorProfile.experience} years
                    </p>
                  </div>

                  <div className="prescription-card-actions">
                    <button className="prescription-card-button prescription-card-button-view">View</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div><br/><br/></>
  );
};

export default PrescriptionManage;
