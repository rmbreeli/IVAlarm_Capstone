import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient"; 
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      sessionStorage.setItem("email", email); 
      navigate("/home");
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>IV Alarm System Login</h1>
        <p>Your Reliable Partner in Care Organization</p>
        <input
          type="email" 
          placeholder="Email" 
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSignIn} className="login-button">
          Sign In
        </button>
        <Link to="/signup">
          <button className="login-button signup-button">Sign Up</button>
        </Link>
        <Link to="/forgot-password" className="forgot-password">
          Forgot Password?
        </Link>

      </div>
    </div>
  );
}

export default LoginPage;