import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createVenue } from "../api/venues";
import VenueForm from "../components/VenueForm";

function CreateVenuePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateVenue(venueData) {
    setError("");
    setIsLoading(true);

    try {
      await createVenue(
        venueData,
        user.accessToken,
        user.apiKey
      );

      navigate("/manager");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
}

  
    if (!isAuthenticated || !user?.venueManager || !user?.apiKey) {
    return (
      <main>
        <p>You must be logged in as a venue manager.</p>
        <Link to="/login">Log in</Link>
      </main>
    );}


  return (
    <main>
      <Link to="/manager">← Back to dashboard</Link>

      <h1>Create new venue</h1>
      <p>Add a new accommodation to Holidaze.</p>

      {error && <p role="alert">{error}</p>}

      <VenueForm
        onSubmit={handleCreateVenue}
        isLoading={isLoading}
        submitLabel="Create venue"
      />
    </main>
  );}

export default CreateVenuePage;
