import React, { useState, useEffect } from 'react';
import '../../components/notification.css';  // Import the CSS file for styles

const Notification = () => {
  let [cuser, setUser] = useState(null); // User state, initially null
  let [loading, setLoading] = useState(true); // Loading state to manage asynchronous actions

  // Fetch user data from localStorage when the component mounts
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser); // Set the user data in state
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);  // Runs only once when the component mounts

  // Fetch updated user data from the backend using cuser._id
  useEffect(() => {
    if (cuser && cuser._id) {
      const fetchUpdatedUserData = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getuser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: cuser._id }),  // Send _id of the user
          });

          const data = await response.json();

          // Only update the user state if the fetched data is different
          if (JSON.stringify(data) !== JSON.stringify(cuser)) {
            setUser(data); // Update state with the new user data
            localStorage.setItem('user', JSON.stringify(data)); // Store the new data in localStorage
          }
        } catch (err) {
          console.log('Error updating the user:', err);
        } finally {
          setLoading(false); // Stop loading once the data is fetched
        }
      };

      fetchUpdatedUserData();
    }
  }, [cuser]); // Only run this effect when `cuser` changes

  // Function to move notification from unseen to seen and update backend and localStorage
  const handleMarkAsSeen = async (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page

    const notificationId = event.target.notificationId.value; // Get the notification ID from the hidden input

    if (cuser && notificationId) {
      // Mark the notification as seen directly
      const updatedNotifications = cuser.notifications.map((n) =>
        n._id === notificationId ? { ...n, seen: true } : n
      );

      // Create an updated user object with modified notifications
      const updatedUser = { ...cuser, notifications: updatedNotifications };

      // Update the user state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Send the updated user to the backend
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notificationId, userId: cuser._id }),  // Send notification ID and user ID
        });

        const msg = await response.json();
      } catch (err) {
        console.log('Error updating notifications on the backend:', err);
      }
    }
  };

  // Function to delete all notifications
  const handleDeleteAllNotifications = async () => {
    if (cuser) {
      const updatedUser = { ...cuser, notifications: [] }; // Clear all notifications
      setUser(updatedUser);

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Send the request to delete notifications on the backend
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete-all-notifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: cuser._id }),  // Send _id of the user
        });
        const msg = await response.json();
        if (msg) {
          console.log(msg);
        }
      } catch (err) {
        console.log('Error deleting notifications on the backend:', err);
      }
    }
  };

  // Render loading state if user data is still being fetched or parsed
  if (loading) {
    return <div>Loading...</div>;
  }

  // Separate unseen and seen notifications
  const unseenNotifications = cuser.notifications.filter((n) => !n.seen);
  const seenNotifications = cuser.notifications.filter((n) => n.seen);

  return (
    <>
      <br />

      <div className="notification-container">
        <h1>Notifications</h1>
  
        <button className="delete-all-button" onClick={handleDeleteAllNotifications}>
          Delete All Notifications
        </button>
  
        {/* Unseen Notifications Section */}
        <div className="notification-card-container">
          {unseenNotifications.length > 0 ? (
            <div>
              <h2>Unseen Notifications</h2>
              <div className="notification-list">
                {unseenNotifications.map((notification, index) => (
                  <div className="notification-card unseen" key={index}>
                    <p>{notification.message}</p>

                    {/* Form for Marking as Seen */}
                    <form onSubmit={handleMarkAsSeen}>
                      <input type="hidden" name="notificationId" value={notification._id} />
                      <button type="submit" className="mark-seen-button">
                        Mark as Seen
                      </button>
                    </form>

                    <small>{notification.type}</small>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No new notifications</p>
          )}
        </div>
    
        {/* Seen Notifications Section */}
        <div className="notification-card-container">
          {seenNotifications.length > 0 ? (
            <div>
              <h2>Seen Notifications</h2>
              <div className="notification-list">
                {seenNotifications.map((notification, index) => (
                  <div className="notification-card seen" key={index}>
                    <p>{notification.message}</p>
                    <small>{notification.type}</small>
                    <a href={notification.onClickPath} target="_blank" rel="noopener noreferrer">
                      Action
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No seen notifications</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notification;
