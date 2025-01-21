// import React, { useState, useEffect } from "react";
// import "./HomePage.css";

// function HomePage() {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [username, setUsername] = useState("Random User"); // Replace with actual username once logged in.

//   // Function to update the current time every second
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   // Formatting time as HH:MM:SS
//   const timeString = currentTime.toLocaleTimeString();
//   const dateString = currentTime.toLocaleDateString();

//   return (
//     <div className="home-page">
//       {/* Header Box */}
//       <div className="header-box">
//         <h1>IV Alarm System Organizer</h1>
//       </div>

//       {/* Date, Time, Username Box */}
//       <div className="info-box">
//         <div className="left">
//           <span>{timeString}</span>
//         </div>
//         <div className="center">
//           <span>{dateString}</span>
//         </div>
//         <div className="right">
//           <span>{username}</span>
//         </div>
//       </div>

//       {/* Priority Columns */}
//       <div className="priority-columns">
//         <div className="column low-priority">
//           <h2>Low Priority</h2>
//           {/* Add content for Low Priority here */}
//         </div>
//         <div className="column medium-priority">
//           <h2>Medium Priority</h2>
//           {/* Add content for Medium Priority here */}
//         </div>
//         <div className="column high-priority">
//           <h2>High Priority</h2>
//           {/* Add content for High Priority here */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomePage;

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import "./HomePage.css";

function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("Random User");

  const [lowPriorityNotifications, setLowPriorityNotifications] = useState([]);
  const [mediumPriorityNotifications, setMediumPriorityNotifications] = useState([]);
  const [highPriorityNotifications, setHighPriorityNotifications] = useState([]);
  const [notificationId, setNotificationId] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Retrieve the username from sessionStorage on mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const notificationInterval = setInterval(() => {
      const priorities = ["Low", "Medium", "High"];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      const randomMessage = `New alarm; Room: XXX`;

      const notification = {
        id: notificationId,
        message: randomMessage,
      };

      if (randomPriority === "Low") {
        setLowPriorityNotifications(prev => [...prev, notification]);
      } else if (randomPriority === "Medium") {
        setMediumPriorityNotifications(prev => [...prev, notification]);
      } else {
        setHighPriorityNotifications(prev => [...prev, notification]);
      }

      setNotificationId(prevId => prevId + 1);
    }, 3000);

    return () => clearInterval(notificationInterval);
  }, [notificationId]);

  const handleResolve = (id, priority) => {
    if (priority === "Low") {
      setLowPriorityNotifications(prev => prev.filter(n => n.id !== id));
    } else if (priority === "Medium") {
      setMediumPriorityNotifications(prev => prev.filter(n => n.id !== id));
    } else if (priority === "High") {
      setHighPriorityNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const timeString = currentTime.toLocaleTimeString();
  const dateString = currentTime.toLocaleDateString();

  return (
    <div className="home-page">
        <div className="header-box">
            <h1>IV Alarm System Organizer</h1>
        </div>

        <div className="info-box">
            <div className="left">
            <span>{timeString}</span>
            </div>
            <div className="center">
            <span>{dateString}</span>
            </div>
            <div className="right">
            <span>{username}</span>
            </div>
        </div>

        <div className="priority-columns">
            <div className="column low-priority">
            <h2>Low Priority</h2>
            {lowPriorityNotifications.map(notification => (
                <div key={notification.id} className="notification-box fade-in">
                    <p>{notification.id}: {notification.message}</p>
                    <button className="resolve-button" onClick={() => handleResolve(notification.id, "Low")}>
                        RESOLVE
                    </button>
                </div>
            ))}
            </div>

            <div className="column medium-priority">
            <h2>Medium Priority</h2>
            {mediumPriorityNotifications.map(notification => (
                <div key={notification.id} className="notification-box fade-in">
                    <p>{notification.id}: {notification.message}</p>
                    <button className="resolve-button" onClick={() => handleResolve(notification.id, "Medium")}>
                        RESOLVE
                    </button>
                </div>
            ))}
            </div>

            <div className="column high-priority">
            <h2>High Priority</h2>
            {highPriorityNotifications.map(notification => (
                <div key={notification.id} className="notification-box fade-in">
                    <p>{notification.id}: {notification.message}</p>
                    <button className="resolve-button" onClick={() => handleResolve(notification.id, "High")}>
                        RESOLVE
                    </button>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
}

export default HomePage;
