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
import "./HomePage.css";
import NotificationBox from "./NotificationBox";


function NotificationColumn({ title, notifications, onResolve }) {
  return (
    <div className="priority-section">
      <div className={`title-box ${title.toLowerCase()}-title`}>
        <h2>{title} Priority</h2>
      </div>
      <div className={`column ${title.toLowerCase()}-priority`}>
        {notifications.map(notification => (
          <NotificationBox
            key={notification.id}
            id={notification.id}
            message={notification.message}
            roomNumber={notification.roomNumber}
            priority={title}
            onResolve={onResolve}
          />
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
    const notificationInterval = setInterval(() => {
      const priorities = ["Low", "Medium", "High"];
      const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
      const randomMessage = `Patient Name: John Doe`;

      const notification = {
        id: notificationId,
        message: randomMessage,
        roomNumber: "XXX", // Make sure to add actual room number here
      };

      if (randomPriority === "Low") setLowPriorityNotifications(prev => [...prev, notification]);
      else if (randomPriority === "Medium") setMediumPriorityNotifications(prev => [...prev, notification]);
      else setHighPriorityNotifications(prev => [...prev, notification]);

      setNotificationId(prevId => prevId + 1);
    }, 3000);

    return () => clearInterval(notificationInterval);
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


// UPDATED FETCH DOWN BELOW 

// import React, { useState, useEffect } from "react";
// import "./HomePage.css";
// import NotificationBox from "./NotificationBox";

// function NotificationColumn({ title, notifications, onResolve }) {
//   return (
//     <div className="priority-section">
//       <div className={`title-box ${title.toLowerCase()}-title`}>
//         <h2>{title} Priority</h2>
//       </div>
//       <div className={`column ${title.toLowerCase()}-priority`}>
//         {notifications.map(notification => (
//           <NotificationBox
//             key={notification.id}
//             id={notification.id}
//             message={notification.message}
//             roomNumber={notification.roomNumber}
//             priority={title}
//             onResolve={onResolve}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function HomePage() {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [username, setUsername] = useState("Random User");

//   // Store notifications from backend
//   const [lowPriorityNotifications, setLowPriorityNotifications] = useState([]);
//   const [mediumPriorityNotifications, setMediumPriorityNotifications] = useState([]);
//   const [highPriorityNotifications, setHighPriorityNotifications] = useState([]);

//   useEffect(() => {
//     const fetchNotifications = () => {
//       fetch("http://localhost:5000/api/get-alarms")
//         .then(response => response.json())
//         .then(data => {
//           console.log("Received Data from Backend:", data);

//           // Categorize notifications based on priority
//           const low = data.filter(n => n.priority === "Low");
//           const medium = data.filter(n => n.priority === "Medium");
//           const high = data.filter(n => n.priority === "High");

//           setLowPriorityNotifications(low);
//           setMediumPriorityNotifications(medium);
//           setHighPriorityNotifications(high);
//         })
//         .catch(error => console.error("Error fetching data:", error));
//     };

//     // Fetch notifications on mount and every 5 seconds
//     fetchNotifications();
//     const intervalId = setInterval(fetchNotifications, 5000);

//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     const storedUsername = sessionStorage.getItem("username");
//     if (storedUsername) setUsername(storedUsername);
//   }, []);

//   useEffect(() => {
//     const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleResolve = (id, priority) => {
//     // Send resolve request to backend
//     fetch(`http://localhost:5000/api/resolve-alarm/${id}`, { method: "POST" })
//       .then(() => {
//         if (priority === "Low") setLowPriorityNotifications(prev => prev.filter(n => n.id !== id));
//         else if (priority === "Medium") setMediumPriorityNotifications(prev => prev.filter(n => n.id !== id));
//         else if (priority === "High") setHighPriorityNotifications(prev => prev.filter(n => n.id !== id));
//       })
//       .catch(error => console.error("Error resolving notification:", error));
//   };

//   return (
//     <div className="home-page">
//       <div className="header-box">
//         <h1>IV Alarm System Organizer</h1>
//       </div>

//       <div className="info-box">
//         <div className="left"><span>{currentTime.toLocaleTimeString()}</span></div>
//         <div className="center"><span>{currentTime.toLocaleDateString()}</span></div>
//         <div className="right"><span>{username}</span></div>
//       </div>

//       <div className="priority-container">
//         <NotificationColumn title="Low" notifications={lowPriorityNotifications} onResolve={handleResolve} />
//         <NotificationColumn title="Medium" notifications={mediumPriorityNotifications} onResolve={handleResolve} />
//         <NotificationColumn title="High" notifications={highPriorityNotifications} onResolve={handleResolve} />
//       </div>
//     </div>
//   );
// }

// export default HomePage;
