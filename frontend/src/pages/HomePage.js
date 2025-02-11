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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("username");
    window.location.href = "/"; 
  };

  // Handle the "Logout" button click, show confirmation modal
  const onLogoutClick = () => {
    setShowLogoutModal(true);
  };

  function handleView() {
    return 1;
  }

  function handleDownload() {
    // Get the current date in the format YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];
  
    // Create the filename
    const filename = `${currentDate}'s Report.txt`;
  
    // Create a Blob with an empty string (representing an empty file)
    const blob = new Blob([""], { type: "text/plain" });
  
    // Create an anchor element for downloading the file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename; // Set the download filename
    
    // Programmatically click the link to trigger the download
    link.click();
  
    // Clean up the object URL
    URL.revokeObjectURL(link.href);
  }
  

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
        {/* Add logout button */}
        <button className="logout-button" onClick={onLogoutClick}>Logout</button>
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

      {/* Popup text */}
      {showLogoutModal && (
        <div className="overlay">
          <div className="popup">
            <div className="popup-content">
              <h3>Are you sure you want to logout?</h3>

              {/* New input section */}
              <div className="email-input-container">
                <label htmlFor="emailReport">Email days report:</label>
                <input
                  id="emailReport"
                  type="text"
                  placeholder="email"
                  // You can handle the input value and onChange here if needed
                />
              </div>

              {/* Download days report section */}
              <div className="download-report-container">
                <label htmlFor="downloadReport">Download days report:</label>
                <button onClick={handleDownload}>Download</button>
              </div>

              {/* View days report section */}
              <div className="view-report-container">
                <label htmlFor="viewReport">View days report:</label>
                <button onClick={handleView}>View</button>
              </div>

              <div className="popup-buttons">
                <button onClick={handleLogout}>Yes</button>
                <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>  
      )}
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
