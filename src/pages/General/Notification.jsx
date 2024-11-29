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

  // Function to mark a notification as seen and update backend
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

  // Function to mark all unseen notifications as seen
  const handleMarkAllAsSeen = async () => {
    if (cuser) {
      const unseenNotifications = cuser.notifications.filter((n) => !n.seen);
      
      if (unseenNotifications.length === 0) return; // If there are no unseen notifications, return early
  
      // Create an array of unseen notification IDs
      const unseenNotificationIds = unseenNotifications.map((n) => n._id);
  
      // Send the array of unseen notification IDs to the backend to mark them as seen
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-all-notifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: cuser._id, notificationIds: unseenNotificationIds }),  // Send user ID and the list of unseen notification IDs
        });
  
        const msg = await response.json();
        console.log(msg);
  
        if (msg.message === "All notifications marked as seen") {
          // Fetch updated user data to reflect the changes on the frontend
          const updatedUserData = await fetchUpdatedUserData();  // You need to implement this fetchUpdatedUserData function
          setUser(updatedUserData);  // Update state with the newly fetched data
          localStorage.setItem('user', JSON.stringify(updatedUserData));  // Update localStorage with new user data
          window.location.reload();
        }
  
      } catch (err) {
        console.log('Error updating all notifications on the backend:', err);
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

      <div className="notifications-container">
        <h1 className="notifications-heading">Notifications</h1>

        {/* Mark All as Seen Button */}
        <button className="mark-all-seen-btn" onClick={handleMarkAllAsSeen}>
          Mark All as Seen
        </button>

        {/* Delete All Notifications Button */}
        <button className="delete-all-btn" onClick={handleDeleteAllNotifications}>
          Delete All Notifications
        </button>

        {/* Unseen Notifications Section */}
        <div className="unseen-notifications-section">
          {unseenNotifications.length > 0 ? (
            <div className="unseen-notifications-container">
              <h2 className="unseen-notifications-heading">Unseen Notifications</h2>
              <div className="unseen-notifications-list">
                {unseenNotifications.map((notification, index) => (
                  <div className="unseen-notification-card" key={index}>
                    <div className="unseen-notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <small className="notification-type">{notification.type}</small>
                    </div>

                    <form onSubmit={handleMarkAsSeen} className="mark-as-seen-form">
                      <input type="hidden" name="notificationId" value={notification._id} />
                      <button type="submit" className="mark-seen-btn">
                        Mark as Seen
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-unseen-notifications">No new notifications</p>
          )}
        </div>

        {/* Seen Notifications Section */}
        <div className="seen-notifications-section">
          {seenNotifications.length > 0 ? (
            <div className="seen-notifications-container">
              <h2 className="seen-notifications-heading">Seen Notifications</h2>
              <div className="seen-notifications-list">
                {seenNotifications.map((notification, index) => (
                  <div className="seen-notification-card" key={index}>
                    <div className="seen-notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <small className="notification-type">{notification.type}</small>
                    </div>

                    <a href={notification.onClickPath} target="_blank" rel="noopener noreferrer" className="action-link">
                      Action
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="no-seen-notifications">No seen notifications</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notification;
