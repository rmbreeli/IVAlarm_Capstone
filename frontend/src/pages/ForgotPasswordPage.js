import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./LoginPage.css";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendResetEmail = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password",
      });
      if (error) throw error;
      alert("Password reset email sent. Check your inbox.");
      navigate("/"); // Redirect to login page after sending email
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Forgot Password?</h1>
        <p>Enter your email to receive a reset link.</p>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSendResetEmail} className="login-button">
          Send Reset Link
        </button>

        <button onClick={() => navigate("/")} className="login-button signup-button">
          Back
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
