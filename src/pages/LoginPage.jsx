import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, createApiKey } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

try {

  const userData = await loginUser(formData);
  const apiKey = await createApiKey(userData.accessToken);

  login({
    ...userData,
    apiKey,
  });

  navigate("/");
} catch (error) {
  setError(error.message);
} finally {
  setIsLoading(false);
}}

  return (
    <main className="auth-page">
      <div className="auth-card">
      <h1>Log in to Holidaze</h1>

      <form  className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button className="auth-button" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p>
        Don't have an account? <Link className="auth-footer" to="/register">
          Register
        </Link>
      </p>
      </div>
    </main>
  );}

export default LoginPage;