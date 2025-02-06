// import React, { useState, useEffect } from "react";
// import "./HomePage.css";

// function HomePage() {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [username, setUsername] = useState("Random User");

//   const [lowPriorityNotifications, setLowPriorityNotifications] = useState([]);
//   const [mediumPriorityNotifications, setMediumPriorityNotifications] = useState([]);
//   const [highPriorityNotifications, setHighPriorityNotifications] = useState([]);
//   const [notificationId, setNotificationId] = useState(1);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/get-alarms") // Ensure this matches your Flask backend URL
//       .then(response => response.json())
//       .then(data => {
//         console.log("Received Data from Backend:", data); // Print data to browser console
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, []);
  
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   // Retrieve the username from sessionStorage on mount
//   useEffect(() => {
//     const storedUsername = sessionStorage.getItem("username");
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, []);

//   useEffect(() => {
//     const notificationInterval = setInterval(() => {
//       const priorities = ["Low", "Medium", "High"];
//       const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
//       const randomMessage = `New alarm; Room: XXX`;

//       const notification = {
//         id: notificationId,
//         message: randomMessage,
//       };

//       if (randomPriority === "Low") {
//         setLowPriorityNotifications(prev => [...prev, notification]);
//       } else if (randomPriority === "Medium") {
//         setMediumPriorityNotifications(prev => [...prev, notification]);
//       } else {
//         setHighPriorityNotifications(prev => [...prev, notification]);
//       }

//       setNotificationId(prevId => prevId + 1);
//     }, 3000);

//     return () => clearInterval(notificationInterval);
//   }, [notificationId]);

//   const handleResolve = (id, priority) => {
//     if (priority === "Low") {
//       setLowPriorityNotifications(prev => prev.filter(n => n.id !== id));
//     } else if (priority === "Medium") {
//       setMediumPriorityNotifications(prev => prev.filter(n => n.id !== id));
//     } else if (priority === "High") {
//       setHighPriorityNotifications(prev => prev.filter(n => n.id !== id));
//     }
//   };

//   const timeString = currentTime.toLocaleTimeString();
//   const dateString = currentTime.toLocaleDateString();

//   return (
//     <div className="home-page">
//         <div className="header-box">
//             <h1>IV Alarm System Organizer</h1>
//         </div>

//         <div className="info-box">
//             <div className="left">
//             <span>{timeString}</span>
//             </div>
//             <div className="center">
//             <span>{dateString}</span>
//             </div>
//             <div className="right">
//             <span>{username}</span>
//             </div>
//         </div>

//     <div className="priority-container">
//         {/* Low Priority Section */}
//         <div className="priority-section">
//           <div className="title-box low-title"><h2>Low Priority</h2></div>
//           <div className="column low-priority">
//             {lowPriorityNotifications.map(notification => (
//               <div key={notification.id} className="notification-box fade-in">
//                 <p>{notification.id}: {notification.message}</p>
//                 <p className="room-number">Room Number: {notification.roomNumber}</p>
//                 <button className="resolve-button" onClick={() => handleResolve(notification.id, "Low")}>
//                   RESOLVE
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Medium Priority Section */}
//         <div className="priority-section">
//           <div className="title-box medium-title"><h2>Medium Priority</h2></div>
//           <div className="column medium-priority">
//             {mediumPriorityNotifications.map(notification => (
//               <div key={notification.id} className="notification-box fade-in">
//                 <p>{notification.id}: {notification.message}</p>
//                 <p className="room-number">Room Number: {notification.roomNumber}</p>
//                 <button className="resolve-button" onClick={() => handleResolve(notification.id, "Medium")}>
//                   RESOLVE
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* High Priority Section */}
//         <div className="priority-section">
//           <div className="title-box high-title"><h2>High Priority</h2></div>
//           <div className="column high-priority">
//             {highPriorityNotifications.map(notification => (
//               <div key={notification.id} className="notification-box fade-in">
//                 <p>{notification.id}: {notification.message}</p>
//                 <p className="room-number">Room Number: {notification.roomNumber}</p>
//                 <button className="resolve-button" onClick={() => handleResolve(notification.id, "High")}>
//                   RESOLVE
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomePage;

// ----------------------------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./HomePage.css";

const socket = io("http://localhost:5000");

function NotificationColumn({ title, notifications, onResolve }) {
  return (
    <div className="priority-section">
      <div className={`title-box ${title.toLowerCase()}-title`}>
        <h2>{title} Priority</h2>
      </div>
      <div className={`column ${title.toLowerCase()}-priority`}>
        {notifications.map(notification => (
          <div key={notification.id} className="notification-box fade-in">
            <p>{notification.id}: {notification.message}</p>
            <p className="room-number">Room Number: {notification.roomNumber}</p>
            <button
              className="resolve-button"
              onClick={() => onResolve(notification.id, title)}
            >
              RESOLVE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("Random User");
  const [lowPriorityNotifications, setLowPriorityNotifications] = useState([]);
  const [mediumPriorityNotifications, setMediumPriorityNotifications] = useState([]);
  const [highPriorityNotifications, setHighPriorityNotifications] = useState([]);
  const [notificationId, setNotificationId] = useState(1);

  useEffect(() => {
    fetch("http://localhost:5000/api/get-alarms")
      .then(response => response.json())
      .then(data => {
        console.log("Received Data from Backend:", data); // Clean up when moving to production
      })
      .catch(error => console.error("Error fetching data:", error));

    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    socket.on("beep_detected", (data) => {
      console.log("Beep detected:", data);

      const notification = {
        id: notificationId,
        message: `Detected ${data.type} at ${data.pitch.toFixed(2)} Hz`,
        roomNumber: "XXX", // Update this if needed
      };

      if (data.type === "LOW BEEP") {
        setLowPriorityNotifications(prev => [...prev, notification]);
      } else if (data.type === "MEDIUM BEEP" || data.type === "UNKNOWN BEEP") {
        setMediumPriorityNotifications(prev => [...prev, notification]);
      } else if (data.type === "HIGH BEEP") {
        setHighPriorityNotifications(prev => [...prev, notification]);
      }

      setNotificationId(prevId => prevId + 1);
    });

    return () => {
      socket.off("beep_detected"); // Cleanup WebSocket listener when component unmounts
    };
  }, [notificationId]);

  const handleResolve = (id, priority) => {
    if (priority === "Low") setLowPriorityNotifications(prev => prev.filter(n => n.id !== id));
    else if (priority === "Medium") setMediumPriorityNotifications(prev => prev.filter(n => n.id !== id));
    else if (priority === "High") setHighPriorityNotifications(prev => prev.filter(n => n.id !== id));
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

      <div className="priority-container">
        <NotificationColumn
          title="Low"
          notifications={lowPriorityNotifications}
          onResolve={handleResolve}
        />
        <NotificationColumn
          title="Medium"
          notifications={mediumPriorityNotifications}
          onResolve={handleResolve}
        />
        <NotificationColumn
          title="High"
          notifications={highPriorityNotifications}
          onResolve={handleResolve}
        />
      </div>
    </div>
  );
}

export default HomePage;
