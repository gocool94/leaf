// GoogleSignIn.js
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSuccess = (credentialResponse) => {
    const user = credentialResponse.credential; // Extract user information
    console.log("Login Success:", user);
    login(user); // Save user data in context
    navigate("/app"); // Redirect to main app
  };

  const onError = () => {
    console.error("Login Failed");
  };

  return (
    <div className="google-signin">
      <h2>Sign in with Google</h2>
      <GoogleLogin onSuccess={onSuccess} onError={onError} useOneTap />
    </div>
  );
};

export default GoogleSignIn;
