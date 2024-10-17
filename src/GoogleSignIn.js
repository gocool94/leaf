// GoogleSignIn.js
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import your custom Auth context

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login function from your Auth context

  const onSuccess = (credentialResponse) => {
    const user = credentialResponse.credential; // Get the credential token from Google response
    console.log("Login Success: User Token:", user);
    login(user); // Save user data in context
    navigate("/search"); // Redirect after successful login
  };

  const onError = () => {
    console.error("Login Failed");
  };

  return (
    <div className="google-signin">
      <h2>Sign in with Google</h2>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap
      />
    </div>
  );
};

export default GoogleSignIn;
