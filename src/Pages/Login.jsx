import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.2 8.3 7.08 5 12 5c4.92 0 8.8 3.3 9.94 6.65a1 1 0 0 1 0 .7C20.8 15.7 16.92 19 12 19c-4.92 0-8.8-3.3-9.94-6.65Z" />
        <circle
          cx="12"
          cy="12"
          r="3"
        />
      </svg>
    );
  }

  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 5.09A10.6 10.6 0 0 1 12 5c4.92 0 8.8 3.3 9.94 6.65a1 1 0 0 1 0 .7 10.9 10.9 0 0 1-4.02 4.75" />
      <path d="M6.61 6.61A10.9 10.9 0 0 0 2.06 11.65a1 1 0 0 0 0 .7C3.2 15.7 7.08 19 12 19a10.6 10.6 0 0 0 2.12-.21" />
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();

  const savedEmail =
    localStorage.getItem("rememberedEmail") || "";

  const [mode, setMode] = useState("login");

  const [email, setEmail] =
    useState(savedEmail);

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(savedEmail !== "");

  const [showLoginPassword, setShowLoginPassword] =
    useState(false);

  const [registerName, setRegisterName] =
    useState("");

  const [registerEmail, setRegisterEmail] =
    useState("");

  const [registerPassword, setRegisterPassword] =
    useState("");

  const [
    registerConfirmPassword,
    setRegisterConfirmPassword,
  ] = useState("");

  const [
    showRegisterPassword,
    setShowRegisterPassword,
  ] = useState(false);

  const [
    showRegisterConfirmPassword,
    setShowRegisterConfirmPassword,
  ] = useState(false);

  const [forgotEmail, setForgotEmail] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmNewPassword,
    setConfirmNewPassword,
  ] = useState("");

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmNewPassword,
    setShowConfirmNewPassword,
  ] = useState(false);

  // =========================================================
  // LOGIN
  // =========================================================

  function handleLogin(e) {
    e.preventDefault();

    const registeredUser = JSON.parse(
      localStorage.getItem("registeredUser") ||
        "null"
    );

    const defaultEmail =
      "yashbsonawane2005@gmail.com";

    const defaultPassword =
      "Yashu@2005";

    const validDefault =
      email === defaultEmail &&
      password === defaultPassword;

    const validRegistered =
      registeredUser &&
      email === registeredUser.email &&
      password === registeredUser.password;

    if (validDefault || validRegistered) {
      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "adminName",
        registeredUser &&
          validRegistered
          ? registeredUser.name
          : "Admin"
      );

      localStorage.setItem(
        "adminEmail",
        email
      );

      if (rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          email
        );
      } else {
        localStorage.removeItem(
          "rememberedEmail"
        );
      }

      alert("Login Successful");

      navigate("/");
    } else {
      alert("Invalid Email or Password");
    }
  }

  // =========================================================
  // REGISTER
  // =========================================================

  function handleRegister(e) {
    e.preventDefault();

    if (
      !registerName ||
      !registerEmail ||
      !registerPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (
      registerPassword !==
      registerConfirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    if (registerPassword.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    const registeredUser = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
    };

    localStorage.setItem(
      "registeredUser",
      JSON.stringify(registeredUser)
    );

    alert(
      "Registration Successful. Please login."
    );

    setEmail(registerEmail);
    setPassword("");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");

    setShowRegisterPassword(false);
    setShowRegisterConfirmPassword(false);

    setMode("login");
  }

  // =========================================================
  // FORGOT PASSWORD
  // =========================================================

  function handleForgotPassword(e) {
    e.preventDefault();

    const registeredUser = JSON.parse(
      localStorage.getItem("registeredUser") ||
        "null"
    );

    const defaultEmail =
      "yashbsonawane2005@gmail.com";

    if (
      forgotEmail !== defaultEmail &&
      (!registeredUser ||
        forgotEmail !== registeredUser.email)
    ) {
      alert("Email address not found.");
      return;
    }

    if (
      !newPassword ||
      !confirmNewPassword
    ) {
      alert(
        "Please enter your new password."
      );
      return;
    }

    if (
      newPassword !==
      confirmNewPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (forgotEmail === defaultEmail) {
      alert(
        "Demo admin password cannot be changed because it is fixed in the application."
      );
      return;
    }

    registeredUser.password =
      newPassword;

    localStorage.setItem(
      "registeredUser",
      JSON.stringify(registeredUser)
    );

    alert(
      "Password changed successfully. Please login."
    );

    setEmail(forgotEmail);
    setPassword("");

    setForgotEmail("");
    setNewPassword("");
    setConfirmNewPassword("");

    setShowNewPassword(false);
    setShowConfirmNewPassword(false);

    setMode("login");
  }

  // =========================================================
  // LOGIN SCREEN
  // =========================================================

  if (mode === "login") {
    return (
      <div className="login-page">
        <div className="login-box">

          <div className="login-title">
            NexaCart Login
          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="login-field">
              <label>Email</label>

              <div className="login-input-box">

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

                <span className="login-icon">
                  👤
                </span>

              </div>
            </div>

            {/* PASSWORD */}

            <div className="login-field">
              <label>Password</label>

              <div className="login-input-box password-input-box">

                <input
                  type={
                    showLoginPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() =>
                    setShowLoginPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showLoginPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showLoginPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon
                    visible={
                      showLoginPassword
                    }
                  />
                </button>

              </div>
            </div>

            {/* OPTIONS */}

            <div className="login-options">

              <label className="remember-option">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setMode("forgot")
                }
              >
                Forgot password
              </button>

            </div>

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

          <div className="register-text">
            Don't have an account?{" "}

            <button
              type="button"
              className="register-button"
              onClick={() =>
                setMode("register")
              }
            >
              Register
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // REGISTER SCREEN
  // =========================================================

  if (mode === "register") {
    return (
      <div className="login-page">
        <div className="login-box">

          <div className="login-title">
            Register
          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="login-field">
              <label>Name</label>

              <div className="login-input-box">

                <input
                  type="text"
                  placeholder="Enter Name"
                  value={registerName}
                  onChange={(e) =>
                    setRegisterName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>
            </div>

            {/* EMAIL */}

            <div className="login-field">
              <label>Email</label>

              <div className="login-input-box">

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>
            </div>

            {/* PASSWORD */}

            <div className="login-field">
              <label>Password</label>

              <div className="login-input-box password-input-box">

                <input
                  type={
                    showRegisterPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create Password"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() =>
                    setShowRegisterPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showRegisterPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showRegisterPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon
                    visible={
                      showRegisterPassword
                    }
                  />
                </button>

              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="login-field">
              <label>
                Confirm Password
              </label>

              <div className="login-input-box password-input-box">

                <input
                  type={
                    showRegisterConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm Password"
                  value={
                    registerConfirmPassword
                  }
                  onChange={(e) =>
                    setRegisterConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() =>
                    setShowRegisterConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showRegisterConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showRegisterConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  <EyeIcon
                    visible={
                      showRegisterConfirmPassword
                    }
                  />
                </button>

              </div>
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Register
            </button>

          </form>

          <div className="register-text">
            Already have an account?{" "}

            <button
              type="button"
              className="register-button"
              onClick={() =>
                setMode("login")
              }
            >
              Login
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // FORGOT PASSWORD SCREEN
  // =========================================================

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="login-title">
          Reset Password
        </div>

        <form onSubmit={handleForgotPassword}>

          {/* EMAIL */}

          <div className="login-field">
            <label>Email</label>

            <div className="login-input-box">

              <input
                type="email"
                placeholder="Enter Registered Email"
                value={forgotEmail}
                onChange={(e) =>
                  setForgotEmail(
                    e.target.value
                  )
                }
                required
              />

            </div>
          </div>

          {/* NEW PASSWORD */}

          <div className="login-field">
            <label>New Password</label>

            <div className="login-input-box password-input-box">

              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() =>
                  setShowNewPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label={
                  showNewPassword
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  showNewPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <EyeIcon
                  visible={
                    showNewPassword
                  }
                />
              </button>

            </div>
          </div>

          {/* CONFIRM NEW PASSWORD */}

          <div className="login-field">
            <label>
              Confirm New Password
            </label>

            <div className="login-input-box password-input-box">

              <input
                type={
                  showConfirmNewPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm New Password"
                value={
                  confirmNewPassword
                }
                onChange={(e) =>
                  setConfirmNewPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={() =>
                  setShowConfirmNewPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label={
                  showConfirmNewPassword
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  showConfirmNewPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                <EyeIcon
                  visible={
                    showConfirmNewPassword
                  }
                />
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Reset Password
          </button>

        </form>

        <div className="register-text">
          Remember your password?{" "}

          <button
            type="button"
            className="register-button"
            onClick={() =>
              setMode("login")
            }
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;