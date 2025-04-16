import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./HomePage.css";
import NotificationBox from "./NotificationBox";
import { supabase } from "../supabaseClient";
import { jsPDF } from "jspdf";

const socket = io("http://localhost:5000");

function NotificationColumn({ title, notifications, onResolve }) {
  return (
    <div className="priority-section">
      <div className={`title-box ${title.toLowerCase()}-title`}>
        <h2>{title} Priority</h2>
      </div>
      <div className={`column ${title.toLowerCase()}-priority`}>
        {notifications.map((notification) => (
          <NotificationBox
            key={notification.id}
            id={notification.id}
            message={notification.message}
            roomNumber={notification.roomNumber}
            priority={title}
            time={notification.timestamp}
            onResolve={onResolve}
          />
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayName, setDisplayName] = useState("Guest");
  const [lowPriorityNotifications, setLowPriorityNotifications] = useState([]);
  const [mediumPriorityNotifications, setMediumPriorityNotifications] = useState([]);
  const [highPriorityNotifications, setHighPriorityNotifications] = useState([]);
  const [notificationId, setNotificationId] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setDisplayName(user.email);
      }
    };
    fetchUser();

    socket.on("beep_detected", (data) => {
      console.log("Received beep event:", data);

      const priorityMap = {
        "LOW": setLowPriorityNotifications,
        "MEDIUM": setMediumPriorityNotifications,
        "HIGH": setHighPriorityNotifications,
      };

      const updateNotifications = priorityMap[data.type];

      if (!updateNotifications) {
        console.log("Unknown beep detected, ignoring...");
        return;
      }

      // const randomRoomNumber = Math.floor(Math.random() * 201) + 100;

      updateNotifications((prev) => [
        ...prev,
        {
          id: notificationId,
          message: `Beep detected: ${data.type} (${data.pitch.toFixed(2)} Hz)`,
          roomNumber: data.room.toString(),
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setNotificationId((prevId) => prevId + 1);
    });

    return () => {
      socket.off("beep_detected");
    };
  }, [notificationId]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const onLogoutClick = () => {
    setShowLogoutModal(true);
  };


  const handleViewReport = () => {
    fetch("http://localhost:5000/get_report")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
  
        const sorted = {
          HIGH: [],
          MEDIUM: [],
          LOW: [],
          UNKNOWN: [],
        };
  
        lines.forEach((line) => {
          if (line.includes("HIGH")) sorted.HIGH.push(line);
          else if (line.includes("MEDIUM")) sorted.MEDIUM.push(line);
          else if (line.includes("LOW")) sorted.LOW.push(line);
          else sorted.UNKNOWN.push(line);
        });
  
        const doc = new jsPDF();
        let y = 30; // Start a bit lower to allow space for the title
  
        const pageWidth = doc.internal.pageSize.getWidth();
  
        // Title
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        const title = "Daily Beep Report";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, y);
        y += 12;
  
        // Date/time
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        const now = new Date();
        const dateTime = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
        const dateWidth = doc.getTextWidth(dateTime);
        doc.text(dateTime, (pageWidth - dateWidth) / 2, y);
        y += 20; // Increase spacing for better readability
  
        // Function to write the notifications by priority
        const writeLines = (title, entries, color) => {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(16);
          doc.text(`${title} PRIORITY`, 10, y);
  
          // Draw a colored line under the header
          const headerWidth = pageWidth - 20; // Make the line span almost the full page width
          const lineX = 10;
          const lineY = y + 3; // Move the line closer to the title by reducing the offset
  
          doc.setDrawColor(color[0], color[1], color[2]); // Set the color (RGB)
          doc.setLineWidth(1); // Make the line thicker
          doc.line(lineX, lineY, lineX + headerWidth, lineY); // Draw the line
  
          y += 10; // Space after the header and line
  
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(12);
  
          if (entries.length === 0) {
            doc.text("No Notifications", 10, y);
            y += 6;
          } else {
            entries.forEach((entry) => {
              if (y > 270) {
                doc.addPage();
                y = 30; // Start new page with some padding
              }
              doc.text(entry, 10, y);
              y += 6;
            });
          }
  
          y += 15; // Add some space between sections
        };
  
        writeLines("HIGH", sorted.HIGH, [255, 127, 127]); 
        writeLines("MEDIUM", sorted.MEDIUM, [255, 213, 107]); 
        writeLines("LOW", sorted.LOW, [161, 227, 161]); 
  
        // Instead of downloading the PDF, open it in a new window
        const pdfData = doc.output("dataurlnewwindow"); // This generates and opens the PDF in a new window

      })
      .catch((error) => {
        console.error("Error generating the report:", error);
      });
  };
  

  const handleDownload = () => {
    fetch("http://localhost:5000/get_report")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => {
        const lines = text.split("\n").filter((line) => line.trim() !== "");
  
        const sorted = {
          HIGH: [],
          MEDIUM: [],
          LOW: [],
          UNKNOWN: [],
        };
  
        lines.forEach((line) => {
          if (line.includes("HIGH")) sorted.HIGH.push(line);
          else if (line.includes("MEDIUM")) sorted.MEDIUM.push(line);
          else if (line.includes("LOW")) sorted.LOW.push(line);
          else sorted.UNKNOWN.push(line);
        });
  
        const doc = new jsPDF();
        let y = 30; // Start a bit lower to allow space for the title
  
        const pageWidth = doc.internal.pageSize.getWidth();
  
        // Title
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        const title = "Daily Alarm Report";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, y);
        y += 12;
  
        // Date/time
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        const now = new Date();
        const dateTime = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
        const dateWidth = doc.getTextWidth(dateTime);
        doc.text(dateTime, (pageWidth - dateWidth) / 2, y);
        y += 20; // Increase spacing for better readability
  
        // Function to write the notifications by priority
        const writeLines = (title, entries, color) => {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(16);
          doc.text(`${title} PRIORITY`, 10, y);
  
          // Draw a colored line under the header
          const headerWidth = pageWidth - 20; // Make the line span almost the full page width
          const lineX = 10;
          const lineY = y + 3; // Move the line closer to the title by reducing the offset
  
          doc.setDrawColor(color[0], color[1], color[2]); // Set the color (RGB)
          doc.setLineWidth(1); // Make the line thicker
          doc.line(lineX, lineY, lineX + headerWidth, lineY); // Draw the line
  
          y += 10; // Space after the header and line
  
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(12);
  
          if (entries.length === 0) {
            doc.text("No Notifications", 10, y);
            y += 6;
          } else {
            entries.forEach((entry) => {
              if (y > 270) {
                doc.addPage();
                y = 30; // Start new page with some padding
              }
              doc.text(entry, 10, y);
              y += 6;
            });
          }
  
          y += 15; // Add some space between sections
        };
  
        writeLines("HIGH", sorted.HIGH, [255, 127, 127]); // Red line for HIGH priority
        writeLines("MEDIUM", sorted.MEDIUM, [255, 213, 107]); // Orange line for MEDIUM priority
        writeLines("LOW", sorted.LOW, [161, 227, 161]); // Green line for LOW priority
        
  
        const filename = `Beep_Report_${now.toISOString().split("T")[0]}.pdf`;
        doc.save(filename);
      })
      .catch((error) => {
        console.error("Error downloading the report:", error);
      });
  };
  

  const handleResolve = (id, priority) => {
    if (priority === "Low")
      setLowPriorityNotifications((prev) => prev.filter((n) => n.id !== id));
    else if (priority === "Medium")
      setMediumPriorityNotifications((prev) => prev.filter((n) => n.id !== id));
    else if (priority === "High")
      setHighPriorityNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const timeString = currentTime.toLocaleTimeString();
  const dateString = currentTime.toLocaleDateString();

  return (
    <div className="home-page">
      <div className="header-box">
        <img src="/greyLogo.png" alt="Logo 192" />
        <div className="title-container">
          <h1 style={{paddingRight: 200}}>IV Alarm System Organizer</h1>
        </div>
        <button className="logout-button" onClick={onLogoutClick}>
          Logout
        </button>
      </div>

      <div className="info-box">
        <div className="left">
          <span>{timeString}</span>
        </div>
        <div className="center">
          <span>{dateString}</span>
        </div>
        <div className="right">
          <span>{displayName}</span>
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
            <button
              className="popup-close"
              onClick={() => setShowLogoutModal(false)}
            >
              &times;
            </button>
            <div className="popup-content">
              {/* <div className="email-row">
                <label htmlFor="emailReport">Email report:</label>
                <input
                  id="emailReport"
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="send-button" onClick={handleEmailReport}>
                  Send
                </button>
              </div> */}

              <div className="button-row">
                <label>View days report:</label>
                <button className="action-button" onClick={handleViewReport}>
                  View
                </button>
              </div>
              <div className="button-row">
                <label>Download days report:</label>
                <button
                  className="action-button"
                  onClick={handleDownload}
                >
                  Download
                </button>
              </div>

              <div className="popup-buttons">
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;