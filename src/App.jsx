import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

// Import components
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
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

// Use the environment variable for API URL
const socket = io(import.meta.env.VITE_API_URL); // Socket connection with API URL

function App() {
  const user = JSON.parse(localStorage.getItem('user')); // Parse user data from localStorage
  const userId = user ? user._id : null; // Get user ID from localStorage
  const userRole = user ? user.role : null; // Get the role of the user from localStorage

  useEffect(() => {
    if (userId) {
      // Ask for notification permission on login
      askForNotificationPermission();

      // Fetch unseen notifications on login
      fetchUnseenNotifications();

      // Socket.io listener for new notifications
      socket.on("new-notification", (newNotification) => {
        Swal.fire({
          title: "New Notification",
          text: newNotification.message,
          icon: "info",
          confirmButtonText: "OK",
        });
      });
    }

    return () => {
      socket.off("new-notification");
    };
  }, [userId]);

  // Request notification permission from the user
  const askForNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Create a subscription object for the user
      const subscription = await subscribeUserForPush();

      // Send subscription data to backend
      fetch(`${import.meta.env.VITE_API_URL}/api/subscribe`, {  // Use the API URL from env
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId,
        }),
      });
    }
  };

  // Subscribe user for push notifications
  const subscribeUserForPush = async () => {
    const registration = await navigator.serviceWorker.register("/service-worker.js");

    const applicationServerKey = urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY);  // VAPID public key

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    return subscription;
  };

  // Helper function to convert VAPID public key from base64 URL format to Uint8Array
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Fetch unseen notifications from the backend
  const fetchUnseenNotifications = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/notifica/${userId}`); // Fixed route format
    const notifications = await response.json();

    notifications.forEach((notification) => {
      // Show notification to the user
      Swal.fire({
        title: "You have a new notification",
        text: notification.message,
        icon: "info",
        confirmButtonText: "OK",
      });
    });
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Homes />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/fp" element={<ForgotPassword />} />
        <Route path="/notify" element={<Notify />} />
        <Route path="/profile" element={<Profile />} />

        {/* User Routes */}
        {userRole === 'ADMIN' && <Route path="/user/manage" element={<Manageuser />} />} {/* Admin-only */}
        
        {/* Patient Routes */}
        {userRole === 'PATIENT' && <Route path="/appmanage" element={<AppManage />} />} {/* Patient-only */}
        {userRole === 'PATIENT' && <Route path="/prescriptions" element={<PrescriptionManage />} />} {/* Patient-only */}
        {userRole === 'PATIENT' && <Route path="/apply" element={<Apply />} />} {/* Patient-only */}
        {userRole === 'PATIENT' && <Route path="/book" element={<BookApp />} />} {/* Patient-only */}

        {/* Doctor Routes */}
        {userRole === 'DOCTOR' && <Route path="/appmanage" element={<AppManage />} />} {/* Doctor-only */}
        <Route path="/doctor/:docid" element={<DoctorProfile />} /> {/* Public route for doctor profile */}
        <Route path="/appointments/:apid" element={<AppointmentDetail />} /> {/* Public route for appointment details */}

        {/* Catch-all Route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
