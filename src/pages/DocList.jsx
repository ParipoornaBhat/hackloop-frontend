import React, { useState, useEffect } from 'react';
import '../components/card.css';  // Add your styles

const ManageUser = () => {
  const [doctors, setDoctors] = useState([]); // Store all doctors
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Store filtered doctors
  const [message, setMessage] = useState(''); // Message to show errors or status
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [specializationFilter, setSpecializationFilter] = useState(''); // Specialization filter state

  // Fetch all doctors from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/docs`);
        const data = await response.json();
        setDoctors(data);  // Set doctors data
        setFilteredDoctors(data);  // Initially show all doctors
      } catch (error) {
        console.log('Error fetching doctor users:', error);
      }
    };

    fetchDoctors();
  }, []);

  // Dynamically filter doctors based on search query and specialization
  useEffect(() => {
    let filtered = doctors;

    // Filter by name (first name + last name)
    if (searchQuery) {
      filtered = filtered.filter((doctor) =>
        `${doctor.doctorProfile.firstname} ${doctor.doctorProfile.lastname}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by specialization
    if (specializationFilter) {
      filtered = filtered.filter((doctor) =>
        doctor.doctorProfile.specialization.toLowerCase().includes(specializationFilter.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);  // Update filtered doctors
  }, [searchQuery, specializationFilter, doctors]);  // Trigger whenever search query or specialization changes

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);  // Update search query state
  };

  // Handle specialization filter change
  const handleSpecializationChange = (e) => {
    setSpecializationFilter(e.target.value);  // Update specialization filter state
  };

  return (
    <> 
      <br />
      <div className="manage-user-container">
        <h1 className="manage-user-heading">Doctor Lists</h1>
        {message && <p className="manage-user-message">{message}</p>}

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search doctors by name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar-input"
          />
        </div>

        <br />

        {/* Specialization Filter */}
        <div>
          <select onChange={handleSpecializationChange} value={specializationFilter} className="specialization-dropdown">
            <option value="">All Specializations</option> {/* Updated this to not use 'selected' */}
            <option value="cardiologist">Cardiologist</option>
            <option value="dermatologist">Dermatologist</option>
            <option value="neurologist">Neurologist</option>
            <option value="pediatrician">Pediatrician</option>
            <option value="orthopedist">Orthopedist</option>
            <option value="gastroenterologist">Gastroenterologist</option>
            <option value="psychiatrist">Psychiatrist</option>
            <option value="dentist">Dentist</option>
            <option value="radiologist">Radiologist</option>
            <option value="gynecologist">Gynecologist</option>
            <option value="urologist">Urologist</option>
            <option value="surgeon">Surgeon</option>
            <option value="endocrinologist">Endocrinologist</option>
            <option value="oncologist">Oncologist</option>
          </select>
        </div>

        <br />

        {/* Doctors List */}
        {filteredDoctors.length === 0 ? (
          <p className="no-doctors-message">No doctors found.</p>
        ) : (
          <div className="doctor-list-container">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.doctorProfile._id} className="doctor-card-item">
                <h2 className="doctor-card-title">{doctor.doctorProfile.firstname} {doctor.doctorProfile.lastname}</h2>
                <p className="doctor-card-info"><strong>Specialization:</strong> {doctor.doctorProfile?.specialization || "Not Available"}</p>
                <p className="doctor-card-info"><strong>Experience:</strong> {doctor.doctorProfile?.experience || "Not Available"} years</p>
                <p className="doctor-card-info"><strong>Fees per Consultation:</strong> ₹{doctor.doctorProfile?.feeperconsultation || "Not Available"}</p>
                <p className="doctor-card-info"><strong>Availability:</strong> {doctor.doctorProfile.from1} - {doctor.doctorProfile.to1}, {doctor.doctorProfile.from2} - {doctor.doctorProfile.to2}</p>
                <a href={`/doctor/${doctor._id}`} className="book-appointment-button">Book Appointment</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageUser;
