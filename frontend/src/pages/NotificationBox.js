import React from "react";
import "./NotificationBox.css";

function NotificationBox({ id, message, roomNumber, priority, onResolve }) {
  return (
    <div className="notification-box fade-in">
      <p>{id}: {message}</p>
      <p className="room-number">Room Number: {roomNumber}</p>
      <button className="resolve-button" onClick={() => onResolve(id, priority)}>
        RESOLVE
      </button>
    </div>
  );
}

export default NotificationBox;
