import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./HomePage.css";
import NotificationBox from "./NotificationBox";
import { supabase } from "../supabaseClient";
// import { jsPDF } from "jspdf";

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
        "LOW BEEP": setLowPriorityNotifications,
        "MEDIUM BEEP": setMediumPriorityNotifications,
        "HIGH BEEP": setHighPriorityNotifications,
      };

      const updateNotifications = priorityMap[data.type];

      if (!updateNotifications) {
        console.log("Unknown beep detected, ignoring...");
        return;
      }

      const randomRoomNumber = Math.floor(Math.random() * 201) + 100;

      updateNotifications((prev) => [
        ...prev,
        {
          id: notificationId,
          message: `Beep detected: ${data.type} (${data.pitch.toFixed(2)} Hz)`,
          roomNumber: randomRoomNumber.toString(),
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

  // const handleEmailReport = () => {
  //   if (!email || !/\S+@\S+\.\S+/.test(email)) {
  //     alert("Please enter a valid email address.");
  //     return;
  //   }
  //   console.log(`Email report to: ${email}`);
  // };

  const handleViewReport = () => {
    console.log("View report");
  };

  function handleDownload() {
    const currentDate = new Date().toISOString().split("T")[0];
    const filename = `${currentDate}'s Report.txt`;
    const blob = new Blob([""], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

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
        <h1>IV Alarm System Organizer</h1>
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