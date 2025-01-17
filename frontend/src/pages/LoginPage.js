import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  // State to hold the values of the inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle sign-in
  const handleSignIn = () => {
    if (username && password) {
      sessionStorage.setItem("username", username);
      navigate("/home"); // Redirect to the homepage
    } else {
      alert("Please fill in both the username and password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>IV Alarm System Login</h1>
        <p>Your Reliable Partner in Care Organization</p>
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignIn} className="login-button">
          Sign In
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
