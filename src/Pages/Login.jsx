import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const savedEmail = localStorage.getItem("rememberedEmail") || "";

  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    savedEmail !== ""
  );

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] =
    useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  // =========================
  // LOGIN
  // =========================

  function handleLogin(e) {
    e.preventDefault();

    const registeredUser = JSON.parse(
      localStorage.getItem("registeredUser") || "null"
    );

    const defaultEmail = "yashbsonawane2005@gmail.com";
    const defaultPassword = "Yashu@2005";

    const validDefault =
      email === defaultEmail &&
      password === defaultPassword;

    const validRegistered =
      registeredUser &&
      email === registeredUser.email &&
      password === registeredUser.password;

    if (validDefault || validRegistered) {
      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem(
        "adminName",
        registeredUser && validRegistered
          ? registeredUser.name
          : "Admin"
      );

      localStorage.setItem("adminEmail", email);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      alert("Login Successful");
      navigate("/");
    } else {
      alert("Invalid Email or Password");
    }
  }

  // =========================
  // REGISTER
  // =========================

  function handleRegister(e) {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (registerPassword.length < 6) {
      alert("Password must be at least 6 characters.");
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

    alert("Registration Successful. Please login.");

    setEmail(registerEmail);
    setPassword("");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");

    setMode("login");
  }

  // =========================
  // FORGOT PASSWORD
  // =========================

  function handleForgotPassword(e) {
    e.preventDefault();

    const registeredUser = JSON.parse(
      localStorage.getItem("registeredUser") || "null"
    );

    const defaultEmail = "yashbsonawane2005@gmail.com";

    if (
      forgotEmail !== defaultEmail &&
      (!registeredUser || forgotEmail !== registeredUser.email)
    ) {
      alert("Email address not found.");
      return;
    }

    if (!newPassword || !confirmNewPassword) {
      alert("Please enter your new password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (forgotEmail === defaultEmail) {
      alert(
        "Demo admin password cannot be changed because it is fixed in the application."
      );
      return;
    }

    registeredUser.password = newPassword;

    localStorage.setItem(
      "registeredUser",
      JSON.stringify(registeredUser)
    );

    alert("Password changed successfully. Please login.");

    setEmail(forgotEmail);
    setPassword("");

    setForgotEmail("");
    setNewPassword("");
    setConfirmNewPassword("");

    setMode("login");
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  if (mode === "login") {
    return (
      <div className="login-page">
        <div className="login-box">

          <div className="login-title">
            NexaCart Login
          </div>

          <form onSubmit={handleLogin}>

            <div className="login-field">
              <label>Email</label>

              <div className="login-input-box">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

                <span className="login-icon">
                  👤
                </span>
              </div>
            </div>

            <div className="login-field">
              <label>Password</label>

              <div className="login-input-box">
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <span className="login-icon">
                  🔒
                </span>
              </div>
            </div>

            <div className="login-options">

              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() => setMode("forgot")}
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
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // REGISTER SCREEN
  // =========================

  if (mode === "register") {
    return (
      <div className="login-page">
        <div className="login-box">

          <div className="login-title">
            Register
          </div>

          <form onSubmit={handleRegister}>

            <div className="login-field">
              <label>Name</label>

              <div className="login-input-box">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={registerName}
                  onChange={(e) =>
                    setRegisterName(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Email</label>

              <div className="login-input-box">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Password</label>

              <div className="login-input-box">
                <input
                  type="password"
                  placeholder="Create Password"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Confirm Password</label>

              <div className="login-input-box">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={registerConfirmPassword}
                  onChange={(e) =>
                    setRegisterConfirmPassword(e.target.value)
                  }
                  required
                />
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
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // FORGOT PASSWORD SCREEN
  // =========================

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="login-title">
          Reset Password
        </div>

        <form onSubmit={handleForgotPassword}>

          <div className="login-field">
            <label>Email</label>

            <div className="login-input-box">
              <input
                type="email"
                placeholder="Enter Registered Email"
                value={forgotEmail}
                onChange={(e) =>
                  setForgotEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>New Password</label>

            <div className="login-input-box">
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Confirm New Password</label>

            <div className="login-input-box">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) =>
                  setConfirmNewPassword(e.target.value)
                }
                required
              />
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
            onClick={() => setMode("login")}
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;