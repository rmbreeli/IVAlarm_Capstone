import React from "react";
import "./NotificationBox.css";

function NotificationBox({ id, message, roomNumber, priority, time, onResolve }) {
  return (
    <div className="notification-box fade-in">
      <p className="room-number">Room Number: {roomNumber}</p>
      <p className="timestamp">Time: {time}</p>
      <button className="resolve-button" onClick={() => onResolve(id, priority)}>
        RESOLVE
      </button>
    </div>
  );
}

export default NotificationBox;
