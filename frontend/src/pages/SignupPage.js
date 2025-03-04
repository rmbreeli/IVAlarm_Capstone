import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./LoginPage.css"; // Use the same styling

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const handleSignUp = async () => {
    try {
      // Check password requirements before calling supabase
      if (!validations.length || !validations.uppercase || !validations.lowercase || !validations.number || !validations.symbol) {
        throw new Error("Password doesn’t meet requirements");
      }
  
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) throw error;
  
      alert("Signup successful! Check your email to confirm.");
      navigate("/");
    } catch (error) {
      alert("Password doesn’t meet requirements");
    }
  };
  

  const handleKeyDown2 = (event) => {
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  // Function to check password criteria
  const validatePassword = (pass) => {
    setPassword(pass);
    setValidations({
      length: pass.length >= 6,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    });
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
          onKeyDown={handleKeyDown2}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => validatePassword(e.target.value)}
          onKeyDown={handleKeyDown2}
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
          <li className={validations.symbol ? "valid" : "❌ invalid"}>
            {validations.symbol ? "✅" : "❌"} One symbol
          </li>
        </ul>

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