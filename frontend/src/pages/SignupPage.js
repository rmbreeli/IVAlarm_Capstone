import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./LoginPage.css"; // Use the same styling

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert("Signup successful! Check your email to confirm.");
      navigate("/");
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>IV Alarm System Signup</h1>
        <p>Create your account</p>
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignUp} className="login-button">
          Sign Up
        </button>
        <Link to="/">
          <button className="login-button signup-button">Back</button>
        </Link>
      </div>
    </div>
  );
}

export default SignupPage;