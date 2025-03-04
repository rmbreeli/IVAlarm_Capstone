import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./LoginPage.css";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const isPasswordValid = Object.values(validations).every(Boolean); // Checks if all conditions are met

  const validatePassword = (pass) => {
    setNewPassword(pass);
    setValidations({
      length: pass.length >= 6,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid) {
      alert("Your password does not meet the requirements! Please try again.");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      alert("Password updated successfully!");
      navigate("/");
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Reset Password</h1>
        <p>Enter a new secure password.</p>

        <input
          type="password"
          placeholder="New Password"
          className="login-input"
          value={newPassword}
          onChange={(e) => validatePassword(e.target.value)}
        />

        <ul className="password-requirements">
          <li className={validations.length ? "valid" : "invalid"}>
            {validations.length ? "✅" : "❌"} At least 6 characters
          </li>
          <li className={validations.uppercase ? "valid" : "invalid"}>
            {validations.uppercase ? "✅" : "❌"} One uppercase letter
          </li>
          <li className={validations.lowercase ? "valid" : "invalid"}>
            {validations.lowercase ? "✅" : "❌"} One lowercase letter
          </li>
          <li className={validations.number ? "valid" : "invalid"}>
            {validations.number ? "✅" : "❌"} One number
          </li>
          <li className={validations.symbol ? "valid" : "invalid"}>
            {validations.symbol ? "✅" : "❌"} One special character
          </li>
        </ul>

        <button onClick={handleResetPassword} className="login-button">
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
