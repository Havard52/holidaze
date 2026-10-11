import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    venueManager: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));}

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email.toLowerCase().endsWith("@stud.noroff.no")) {
      setError("You MUST use a @stud.noroff.no email adress.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData);

      setSuccess("Account created sucsessfully! Now you can log in.");

      setFormData({
        name: "",
        email: "",
        password: "",
        venueManager: false,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }}

  return (
    <main>
      <h1>Create an account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={20}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
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
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor="venueManager">
            <input
              id="venueManager"
              name="venueManager"
              type="checkbox"
              checked={formData.venueManager}
              onChange={handleChange}
            />
            Register as a Venue Manager
          </label>
        </div>

        {error && <p role="alert">{error}</p>}

        {success && <p role="status">{success}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Do you already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );}

export default RegisterPage;