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
    <> <br /><br /><br /><br />
      <div>
       
        <h1>Doctor Lists</h1>
        {message && <p>{message}</p>}

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search doctors by name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />
        </div>

        {/* Specialization Filter */}
        <div>
        <select onChange={handleSpecializationChange} value={specializationFilter} className="specialization-filter">
  <option value=""  selected>All Specializations</option>
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
  {/* Add more specializations here */}
</select>

        </div>

        {/* Doctors List */}
        {filteredDoctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <div className="doctor-list">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.doctorProfile._id} className="doctor-card" >
                <h2>{doctor.doctorProfile.firstname} {doctor.doctorProfile.lastname}</h2>
                <p><strong>Specialization:</strong> {doctor.doctorProfile?.specialization || "Not Available"}</p>
                <p><strong>Experience:</strong> {doctor.doctorProfile?.experience || "Not Available"} years</p>
                <p><strong>Fees per Consultation:</strong> ₹{doctor.doctorProfile?.feeperconsultation || "Not Available"}</p>
                <p><strong>Availability:</strong> {doctor.doctorProfile.from1} - {doctor.doctorProfile.to1}, {doctor.doctorProfile.from2} - {doctor.doctorProfile.to2}</p>
                {/* Book Appointment Button */console.log(doctor)}
                <a href={`/doctor/${doctor._id}`} className="book-appointment-btn">
                  Book Appointment
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageUser;
