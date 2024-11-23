import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../components/appointment.css';
// Function to generate dates for the next one month
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

const DoctorProfile = () => {
    const [docpro, setDoc] = useState(null); // Doctor Profile
    const [availableSlots, setAvailableSlots] = useState([]); // Available Slots
    const [selectedDate, setSelectedDate] = useState(null); // Selected Date
    const [selectedSlot, setSelectedSlot] = useState(null); // Selected Slot
    const [description, setDescription] = useState(''); // Patient's description
    const [datesInNextMonth, setDatesInNextMonth] = useState([]); // Dates for the next month
    const cuser = JSON.parse(localStorage.getItem('user'));
    const { docid } = useParams();  // Get doctor ID from URL

    useEffect(() => {
        // Generate the dates for the next one month
        const nextMonthDates = generateNextMonthDates();
        setDatesInNextMonth(nextMonthDates);
    }, []);

    useEffect(() => {
        const func = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/docprofile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: docid }),
                });
                const doc = await response.json();
                setDoc(doc);
            } catch (er) {
                console.log(er);
            }
        };
        func();
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
                // Sending the appointment booking request to the backend
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookAppointment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        patientId: cuser._id,          // Patient's ID from the logged-in user
                        doctorId: docid,               // Doctor's ID (from URL parameter)
                        appointmentDate: selectedDate, // The selected date for the appointment
                        timeSlot: selectedSlot,        // The selected time slot for the appointment
                        description: description,      // Patient's description for the appointment
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    alert('Appointment booked successfully');
                    window.location.reload();
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
        return <div>Loading...</div>;
    }

    return (
        <div>
            {cuser.role === 'ADMIN' &&
                <div className="frm">
                    <div className="wrapper">
                        <br />
                        <h1>Doctor Profile</h1>
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

                            <p><strong>From 1 (Opening Time):</strong> {docpro.doctorProfile.from1}</p>
                            <p><strong>To 1 (Closing Time):</strong> {docpro.doctorProfile.to1}</p>
                            {docpro.doctorProfile.from2 && docpro.doctorProfile.to2 && (
                                <>
                                    <p><strong>From 2 (Second Opening Time):</strong> {docpro.doctorProfile.from2}</p>
                                    <p><strong>To 2 (Second Closing Time):</strong> {docpro.doctorProfile.to2}</p>
                                </>
                            )}
                            <p><strong>Working Days:</strong> 
                              {docpro.doctorProfile.workingDays
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
                    </div>
                </div>
            }

            {cuser.role === 'PATIENT' && (<><br/><br/><br/><br/><br/>
                   <div className="appointmentCard"><center>
                   <h2>Book an Appointment with <br/>Dr. {docpro.doctorProfile.firstname} {docpro.doctorProfile.lastname}</h2>
                   </center>

                   <DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  minDate={new Date()}
  dateFormat="dd-MM-yyyy"
  includeDates={datesInNextMonth}  // Limiting to next month as needed
  className="text-black bg-gray-200 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
  wrapperClassName="datepicker-wrapper"
  popperPlacement="bottom"  // Ensure the calendar is always below the input
  disabledKeyboardNavigation={true}  // Optional: Disable keyboard navigation for dates
  dayClassName={(date) => {
    const dayOfWeek = date.getDay().toString();
    if (!docpro.doctorProfile.workingDays.includes(dayOfWeek)) {
      return "react-datepicker__day--disabled";  // Disable the day
    }
    return "";  // Allow the day if it is a working day
  }}
/>




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
               </div><br/></>
            )}
            <br /><br />
        </div>
    );
};

export default DoctorProfile;
