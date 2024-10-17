import React, { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import "./Login.css"; // Make sure to create this CSS file

const Login = ({ setIsAuthenticated, setUserEmail }) => {
  const handleLoginSuccess = (response) => {
    const { email } = response.profileObj;
    localStorage.setItem("google_token", response.tokenId); // Store the token for authentication
    setUserEmail(email); // Set the user email
    setIsAuthenticated(true); // Update authentication state
  };

  const handleLoginFailure = (response) => {
    console.error("Login failed: ", response);
  };

  useEffect(() => {
    /* You can add any side-effects or cleanup code here if needed */
  }, []);

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome, please sign in</h1>
        <p>Sign in with your Google account to proceed</p>
      </div>
      <div className="google-login-button">
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Sign in with Google"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </div>
  );
};

export default Login;
