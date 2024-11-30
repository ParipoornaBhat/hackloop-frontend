import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import '../components/manage.css';

const AppManage = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [cuser, setCuser] = useState(null);
  
  // Use the useNavigate hook to navigate programmatically
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCuser(user);
  
    if (!user) {
      console.log("no user");
      setError('No user found in localStorage');
      return;
    }
  
    // Send POST request with user._id
    fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
      method: 'POST',  // Use POST method
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: user._id }),  // Pass the user._id as an object
    })
      .then(response => response.json())
      .then(data => {
        setAppointments(data);
      })
      .catch(err => {
        setError('Failed to fetch appointments');
      });
  }, []);
  

  const handleAction = (action, appointmentId) => {
    const url = `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}/${action}`;
  
    fetch(url, { method: 'POST' })
      .then(response => response.json())
      .then(() => {
        // You may want to handle the action result here if the backend sends back updated data.
        // Refetch appointments after the action is performed
        fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: cuser._id })  // Assuming 'cuser' holds the current logged-in user.
        })
          .then(res => res.json())
          .then(data => setAppointments(data))
          .catch(() => setError('Failed to fetch updated appointments'));
      })
      .catch(() => {
        setError(`Failed to ${action} appointment`);
      });
  };
  

  const handleAppointmentClick = (appointmentId) => {
    // Use navigate() to programmatically navigate to the appointment detail page
    navigate(`/appointments/${appointmentId}`);
  };

  // Separate appointments based on their status
  const upcomingAppointments = appointments.filter(app => app.status !== 'completed');
  const completedAppointments = appointments.filter(app => app.status === 'completed');

  // Sort both lists by appointmentDate in descending order (newest first)
  upcomingAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  completedAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  return (
    <div className="app-manage__container">
  <br /><br />
  <div className="app-manage">
    <h2 className="app-manage__heading">Appointment Management</h2>
    {error && <p className="app-manage__error">{error}</p>}

    {/* Upcoming Appointments */}
    <div className="app-manage__appointments"><br />
      {upcomingAppointments.length === 0 ? (
        <p className="app-manage__no-appointments">No upcoming appointments available.</p>
      ) : (
        upcomingAppointments.map((appointment) => {
          const { _id, patient, doctor, appointmentDate, status } = appointment;
          const isPatient = cuser.role === 'PATIENT';
          const isDoctor = cuser.role === 'DOCTOR';

          return (
            <div
              key={_id}
              className="app-manage__appointment-card"
              onClick={() => handleAppointmentClick(_id)}
            >
              <h3 className="app-manage__appointment-card-title">{`Appointment with Dr. ${doctor.doctorProfile.firstname}`}</h3>
              <p className="app-manage__appointment-card-date">{`Date: ${new Date(appointmentDate).getDate().toString().padStart(2, '0')}/${(new Date(appointmentDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(appointmentDate).getFullYear()}`}</p>
              <p className="app-manage__appointment-card-status">{`Status: ${status}`}</p>
              <div className="app-manage__appointment-card-actions">
                {status === 'requested' && (
                  <>
                    {isPatient && (
                      <button
                        className="app-manage__cancel-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event from bubbling up to parent div
                          handleAction('cancel', _id);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    {isDoctor && (<>
                      <button
                        className="app-manage__confirm-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event from bubbling up to parent div
                          handleAction('confirm', _id);
                        }}
                      >
                        Confirm
                      </button>
                      <button
                      className="app-manage__cancel-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event from bubbling up to parent div
                        handleAction('cancel', _id);
                      }}
                    >
                      Cancel
                    </button>
                    </>)}
                  </>
                )}
                {status === 'confirmed' && isDoctor && (
                  <button
                    className="app-manage__complete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up to parent div
                      navigate(`/appointments/${_id}`)
                    }}
                  >
                    Complete
                  </button>
                )}
                {status === 'cancelled' && isDoctor && (
                  <button
                    className="app-manage__delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up to parent div
                      handleAction('delete-d', _id);
                    }}
                  >
                    Delete
                  </button>
                )}
                {status === 'cancelled' && isPatient && (
                  <button
                    className="app-manage__delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up to parent div
                      handleAction('delete-p', _id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>

    {/* Completed Appointments History */}
    <div className="app-manage__appointments-history">
      <h3 className="app-manage__appointments-history-title">Appointment History</h3>
      {completedAppointments.length === 0 ? (
        <><br /> <p className="app-manage__no-appointments">No completed appointments available.</p></>
      ) : (
        completedAppointments.map((appointment) => {
          const { _id, patient, doctor, appointmentDate, status } = appointment;

          return (
            <div
              key={_id}
              className="app-manage__appointment-card"
              onClick={() => handleAppointmentClick(_id)}
            >
              <h3 className="app-manage__appointment-card-title">{`Appointment with Dr. ${doctor.firstname}`}</h3>
              <p className="app-manage__appointment-card-date">{`Date: ${new Date(appointmentDate).getDate().toString().padStart(2, '0')}/${(new Date(appointmentDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(appointmentDate).getFullYear()}`}</p>
              <p className="app-manage__appointment-card-status">{`Status: ${status}`}</p>
            </div>
          );
        })
      )}
    </div>
  </div>
  <br /><br /><br />
</div>

  );
};

export default AppManage;
