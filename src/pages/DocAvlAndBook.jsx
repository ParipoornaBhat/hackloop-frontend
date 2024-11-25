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
        <div className="frm">
          <h1 className="doctor-profile-heading">Doctor Profile</h1>
          <div className="profile-details">
            <p><strong>Name:</strong> {docpro.username}</p>
            <p><strong>Email:</strong> {docpro.email}</p>
            <p><strong>Role:</strong> {docpro.role}</p>
            <p><strong>Joined On:</strong> {new Date(docpro.createdAt).toLocaleDateString()}</p>
            {docpro.updatedAt && (
              <p><strong>Last Updated:</strong> {new Date(docpro.updatedAt).toLocaleDateString()}</p>
            )}
          </div>
          <div className="doctor-profile-details">
            <h3>Doctor Profile</h3>
            <p><strong>First Name:</strong> {docpro.doctorProfile.firstname}</p>
            <p><strong>Last Name:</strong> {docpro.doctorProfile.lastname}</p>
            <p><strong>Specialization:</strong> {docpro.doctorProfile.specialization}</p>
            <p><strong>Experience:</strong> {docpro.doctorProfile.experience}</p>
            <p><strong>Fee per Consultation:</strong> {docpro.doctorProfile.feeperconsultation}</p>
            <p><strong>Working Days:</strong> 
              {docpro.doctorProfile.workingDays
                .map(day => day === '0' ? 'Sunday' :
                  day === '1' ? 'Monday' :
                  day === '2' ? 'Tuesday' :
                  day === '3' ? 'Wednesday' :
                  day === '4' ? 'Thursday' :
                  day === '5' ? 'Friday' :
                  day === '6' ? 'Saturday' : ''
                )
                .join(', ') }
            </p>
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
