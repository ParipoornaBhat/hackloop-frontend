import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Theme from './layouts/Theme';

// Importing the pages for each role
import Homes from './pages/General/Homes';
import Login from './pages/General/Login';
import NotFound from './pages/General/NotFound';
import Signup from './pages/General/Signup';
import Profile from './pages/General/Profile';
import ForgotPassword from './pages/General/ForgotPassword';
import Manageuser from './pages/Manageuser';
import Apply from './pages/Apply';
import Notify from './pages/General/Notification';
import BookApp from './pages/DocList';
import DoctorProfile from './pages/DocAvlAndBook';
import AppointmentDetail from './pages/AppointmentDetail';
import AppManage from './pages/AppManage';
import PrescriptionManage from './pages/PrescriptionManage';


function App() {
  const user = JSON.parse(localStorage.getItem('user')); // Parse user data from localStorage
  const userRole = user ? user.role : null; // Get the role of the user from the localStorage
  return (
    <>
      <Navbar />
      <Theme />
      <Routes>
        <Route path="/" element={<Homes />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/fp" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notify" element={<Notify />} />
        <Route path="/doctor/:docid" element={<DoctorProfile />} />
        <Route path="/appointments/:apid" element={<AppointmentDetail />} />
        {/* Role-based Routes */}
        {userRole === 'ADMIN' && <Route path="/user/manage" element={<Manageuser />} />}
        {userRole === 'PATIENT' &&<Route path="/appmanage" element={<AppManage />} />}
        {userRole === 'PATIENT' &&<Route path="/prescriptions" element={<PrescriptionManage />} />}
        {userRole==='DOCTOR' &&<Route path="/appmanage" element={<AppManage />} />}
        {userRole === 'PATIENT' && <Route path="/apply" element={<Apply />} />}
        {userRole === 'PATIENT' && <Route path="/book" element={<BookApp />} />}
        {/*{userRole === 'DOCTOR' && <Route path="/doctor" element={<DoctorPage />} />}
        {userRole === 'PATIENT' && <Route path="/patient" element={<PatientPage />} />}
        */}

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
