import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../components/appointment.css';  // Using the same CSS file name as in the original code
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const DoctorProfile = () => {
  const [docpro, setDoc] = useState(null); // Doctor Profile
  const [availableSlots, setAvailableSlots] = useState([]); // Available Slots
  const [selectedDate, setSelectedDate] = useState(null); // Selected Date
  const [selectedSlot, setSelectedSlot] = useState(null); // Selected Slot
  const [description, setDescription] = useState(''); // Patient's description
  const [datesInNextMonth, setDatesInNextMonth] = useState([]); // Dates for the next month
  const cuser = JSON.parse(localStorage.getItem('user'));
  const { docid } = useParams();  // Get doctor ID from URL
  const navigate = useNavigate();

  // Generate dates for the next month
  const generateNextMonthDates = () => {
    const dates = [];
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    while (today <= oneMonthLater) {
      dates.push(new Date(today));
      today.setDate(today.getDate() + 1);
    }
    return dates;
  };

  useEffect(() => {
    // Generate the dates for the next one month
    const nextMonthDates = generateNextMonthDates();
    setDatesInNextMonth(nextMonthDates);
  }, []);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/docprofile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: docid }),
        });
        const doc = await response.json();
        setDoc(doc);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      }
    };
    fetchDoctorProfile();
  }, [docid]);

  useEffect(() => {
    if (selectedDate) {
      const fetchAvailableSlots = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getAvailableSlots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              doctorId: docid,
              date: selectedDate.toISOString(),
            }),
          });
          const data = await response.json();
          setAvailableSlots(data);
        } catch (error) {
          console.error('Error fetching available slots:', error);
        }
      };
      fetchAvailableSlots();
    }
  }, [selectedDate, docid]);

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handleAppointmentBooking = async () => {
    if (selectedSlot && selectedDate) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookAppointment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId: cuser._id,          
            doctorId: docid,               
            appointmentDate: selectedDate, 
            timeSlot: selectedSlot,        
            description: description,     
          }),
        });

        const data = await response.json();
        if (data.success) {
          alert('Appointment booked successfully');
          navigate('/appmanage');
        } else {
          alert(data.message || 'Failed to book appointment');
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
        alert('An error occurred while booking the appointment.');
      }
    } else {
      alert('Please select a date and time slot');
    }
  };

  if (!docpro) {
    return (<div><br/><br/><br/><br/><br/>Loading...<br/><br/></div>);
  }

  return (<><br/><br/><br/>
    <div className="doctor-profile-container">
    {cuser.role === 'ADMIN' && (
  <div className="admin-profile-container">
    <h1 className="admin-profile-heading">Doctor Profile</h1>
    
    <div className="admin-profile-main">
      <div className="admin-profile-info">
        <p className="admin-profile-label"><strong>Name:</strong> {docpro.username}</p>
        <p className="admin-profile-label"><strong>Email:</strong> {docpro.email}</p>
        <p className="admin-profile-label"><strong>Role:</strong> {docpro.role}</p>
        <p className="admin-profile-label">
  <strong>Joined On:</strong> {new Date(docpro.createdAt).getDate().toString().padStart(2, '0')}/{(new Date(docpro.createdAt).getMonth() + 1).toString().padStart(2, '0')}/{new Date(docpro.createdAt).getFullYear()}
</p>
        
        {docpro.updatedAt && (
          <p className="admin-profile-label">
  <strong>Last Updated:</strong> 
  {docpro.updatedAt 
    ? `${new Date(docpro.updatedAt).getDate().toString().padStart(2, '0')}/${
        (new Date(docpro.updatedAt).getMonth() + 1).toString().padStart(2, '0')}/${
        new Date(docpro.updatedAt).getFullYear()}`
    : 'Not available'}
</p>
        )}
      </div>

      {/* Only render if doctorProfile exists */}
      {docpro.doctorProfile && (
        <div className="doctor-profile-section">
          <h3 className="doctor-profile-heading">Doctor Profile Details</h3>
          <div className="doctor-profile-details">
            <p className="doctor-profile-item"><strong>First Name:</strong> {docpro.doctorProfile.firstname}</p>
            <p className="doctor-profile-item"><strong>Last Name:</strong> {docpro.doctorProfile.lastname}</p>
            <p className="doctor-profile-item"><strong>Specialization:</strong> {docpro.doctorProfile.specialization}</p>
            <p className="doctor-profile-item"><strong>Experience:</strong> {docpro.doctorProfile.experience} years</p>
            <p className="doctor-profile-item"><strong>Fee per Consultation:</strong> Rs. {docpro.doctorProfile.feeperconsultation}</p>
            <p className="doctor-profile-item"><strong>Working Days:</strong> 
              {docpro.doctorProfile.workingDays
                .map(day => {
                  switch(day) {
                    case '0': return 'Sunday';
                    case '1': return 'Monday';
                    case '2': return 'Tuesday';
                    case '3': return 'Wednesday';
                    case '4': return 'Thursday';
                    case '5': return 'Friday';
                    case '6': return 'Saturday';
                    default: return '';
                  }
                })
                .join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)}


      {cuser.role === 'PATIENT' && (
        <div className="appointmentCard">
          <h2 className="doctor-profile-heading">Book an Appointment with Dr. {docpro.doctorProfile.firstname} {docpro.doctorProfile.lastname}</h2>

          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              dateFormat="dd-MM-yyyy"
              includeDates={datesInNextMonth}
              className="text-black bg-gray-200 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              popperPlacement="bottom"
              disabledKeyboardNavigation={true}
              dayClassName={(date) => {
                const dayOfWeek = date.getDay().toString();
                if (!docpro.doctorProfile.workingDays.includes(dayOfWeek)) {
                  return "react-datepicker__day--disabled";
                }
                return "";
              }}
            />
          </div>

          <div>
            <h3>Available Slots:</h3>
            {availableSlots.length > 0 ? (
              <div className="availableSlots">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`slotButton ${selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => handleSlotSelection(slot)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <p>No slots available for this date.</p>
            )}
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
            />
          </div>

          <button onClick={handleAppointmentBooking}>Book Appointment</button>
        </div>
      )}
    </div><br/><br/></>
  );
};

export default DoctorProfile;
