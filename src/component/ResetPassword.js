import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ErrorMessages from "./ErrorMessages";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // get email from local storage or url
  let email = localStorage.getItem("email");
  if (!email) {
    email = queryParams.get("email");
  }

  const [errors, setErrors] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // after form submission, wait for a response for POST request
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/resetPassword", {
        email,
        password,
        confirmPassword,
      });
      if (response.status === 200) {
        // if successful response, redirect user to login page
        navigate(`/login`);
      } else {
        // if there is a match with database
        setErrors([response.data.error || "Invalid token."]);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.errors) {
        // set errors from response
        setErrors(error.response.data.errors);
      } else {
        // catch other errors
        setErrors(["Failed to reset password. Try again later."]);
      }
    }
  }

  // as user types, update password and confirm password values
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  /* on click, toggle password text visibility*/
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <section id="body-style-light">
      {/* click brand heading to redirec to home page*/}
      <section id="brand-heading">
        <h1>
          <Link to="/" id="return-home-btn">
            YarnForge
          </Link>
        </h1>
      </section>

      {/* reset password page container*/}
      <div className="auth-page">
        {/* reset password form*/}
        <div className="form">
          <h2>Reset Password</h2>

          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="input-box">
              {/* password input box*/}
              <input
                name="password"
                id="password-field"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                required
                onChange={handlePasswordChange}
              />
              <span
                className={`field-icon bx ${
                  showPassword ? "bx-show" : "bx-hide"
                }`}
                onClick={togglePasswordVisibility}
              ></span>
            </div>
            <div className="input-box">
              <input
                name="confirmPassword"
                id="confirm-password-field"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </div>
            {/* toggle icon for password visibility*/}
            <span
              className={`field-icon bx ${
                showPassword ? "bx-show" : "bx-hide"
              }`}
              onClick={togglePasswordVisibility}
            ></span>

            <div>
              <button type="submit" name="reset-password-submit">
                Reset Password
              </button>
            </div>
          </form>
          {/* error messages*/}
          <ErrorMessages errors={errors} />
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
