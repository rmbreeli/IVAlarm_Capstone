import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./HomePage.css";
import NotificationBox from "./NotificationBox";
import { jsPDF } from "jspdf";


const socket = io("http://localhost:5000");

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
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    socket.on("beep_detected", (data) => {
      console.log("Received beep event:", data);
    
      const priorityMap = {
        "LOW BEEP": setLowPriorityNotifications,
        "MEDIUM BEEP": setMediumPriorityNotifications,
        "HIGH BEEP": setHighPriorityNotifications,
      };
    
      const updateNotifications = priorityMap[data.type];
      
      if (!updateNotifications) {
        console.log("Unknown beep detected, ignoring...");
        return;
      }
      
      // Random number generator
      const randomRoomNumber = Math.floor(Math.random() * 201) + 100
    
      updateNotifications(prev => [
        ...prev, 
        { 
          id: notificationId, 
          message: `Beep detected: ${data.type} (${data.pitch.toFixed(2)} Hz)`, 
          // Set the random room number
          roomNumber: randomRoomNumber.toString(), 
        }
      ]);
    
      setNotificationId(prevId => prevId + 1);
    });

    return () => {
      socket.off("beep_detected");
    };
  }, [notificationId]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    window.location.href = "/"; 
  };

  const onLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleEmailReport = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    console.log(`Email report to: ${email}`);
  };

  const handleViewReport = () => {
    console.log("View report");
  };

  // Download changed to PDF
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Title and Report Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`Alarm Report`, 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
    
    // Page Number Handling
    let pageNumber = 1;
    const addPageNumber = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${pageNumber}`, 200, 290, { align: "right" });
      pageNumber++;
    };
  
    // Function to Add Notifications Section
    const addNotifications = (priorityTitle, notifications, startY, color) => {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...color);
      doc.text(`${priorityTitle} Priority:`, 10, startY);
      
      doc.setDrawColor(...color);
      doc.line(10, startY + 2, 200, startY + 2); // Underline for Title
  
      let currentYPosition = startY + 10;
  
      if (notifications.length === 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("No notifications.", 15, currentYPosition);
        return currentYPosition + 10;
      }
  
      notifications.forEach((n, index) => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        const message = `${index + 1}. Room: ${n.roomNumber} - ${n.message}`;
        doc.text(message, 15, currentYPosition);
        currentYPosition += 8;
  
        // Check for page overflow and handle page breaks
        if (currentYPosition > 270) {
          addPageNumber();
          doc.addPage();
          currentYPosition = 20;
        }
      });
  
      return currentYPosition + 10;
    };
  
    // Start adding content
    let currentYPosition = 40;
  
    // Add Notifications by Priority
    currentYPosition = addNotifications("High", highPriorityNotifications, currentYPosition, [255, 0, 0]);
    currentYPosition = addNotifications("Medium", mediumPriorityNotifications, currentYPosition, [255, 165, 0]);
    currentYPosition = addNotifications("Low", lowPriorityNotifications, currentYPosition, [34, 139, 34]);
  
    // Summary Section with clear formatting
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Summary:", 10, currentYPosition);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`High Priority: ${highPriorityNotifications.length}`, 15, currentYPosition + 10);
    doc.text(`Medium Priority: ${mediumPriorityNotifications.length}`, 15, currentYPosition + 20);
    doc.text(`Low Priority: ${lowPriorityNotifications.length}`, 15, currentYPosition + 30);
  
    // Add final page number
    addPageNumber();
  
    // Save the PDF
    doc.save(`${currentDate}'s_Report.pdf`);
  };
  
  
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

{showLogoutModal && (
  <div className="overlay">
    <div className="popup">
      <button className="popup-close" onClick={() => setShowLogoutModal(false)}>
        &times;
      </button>
      <div className="popup-content">
        {/* Email Input and Send Button in the Same Row */}
        <div className="email-row">
          <label htmlFor="emailReport">Email report:</label>
          <input
            id="emailReport"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="send-button" onClick={handleEmailReport}>Send</button>
        </div>

        {/* Button Rows with Labels */}
        <div className="button-row">
          <label>View days report:</label>
          <button className="action-button" onClick={handleViewReport}>View</button>
        </div>
        <div className="button-row">
          <label>Download days report:</label>
          <button className="action-button" onClick={handleDownloadReport}>Download</button>
        </div>

        {/* Logout and Cancel Buttons */}
        <div className="popup-buttons">
          <button onClick={handleLogout}>Logout</button>
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