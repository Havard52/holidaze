import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyVenues, updateVenue } from "../api/venues";
import VenueForm from "../components/VenueForm";

function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user?.venueManager || !user?.apiKey) {
      return;
    }

    let active = true;

    async function loadVenue() {
      setIsLoading(true);
      setError("");
      setVenue(null);

      try {
        const venues = await getMyVenues(
          user.name,
          user.accessToken,
          user.apiKey
        );

        const selectedVenue = venues.find(
          (venue) => venue.id === id
        );

        if (!selectedVenue) {
          throw new Error(
            "Venue not found or you do not have permission to edit it."
          );
        }

        if (active) {
          setVenue(selectedVenue);
        }
      } catch (error) {
        if (active) {
          setError(error.message);
        }
         } finally {
        if (active) {
          setIsLoading(false);
        }}}

    loadVenue();

    return () => {
      active = false;
    };
  }, [id, user, isAuthenticated]);


     async function handleUpdateVenue(venueData) {
    setError("");
    setIsSaving(true);

     try {
      const updatedData = {
        ...venueData,
        media: [
          ...venueData.media,
          ...(venue.media ?? []).slice(1),
        ],
        location: {
          ...venue.location,
          ...venueData.location,
        },};

      await updateVenue(
        id,
        updatedData,
        user.accessToken,
        user.apiKey
      );

     navigate("/manager");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  }


  if (!isAuthenticated || !user?.venueManager || !user?.apiKey) {
    return (
      <main>
        <p>You must be logged in as a venue manager if you want to edit venue.</p>
        <Link to="/login">Log in</Link>
      </main>
    );}


  if (isLoading) {
    return <p>Loading venue...</p>;
  }

  if (!venue) {
    return (
      <main>
        <p role="alert">{error || "Venue not found."}</p>
        <Link to="/manager">Back to dashboard</Link>
      </main>
    );}

  return (
    <main>
      <Link to="/manager">← Back to dashboard</Link>

      <h1>Edit venue</h1>
      <p>Update the information for {venue.name}.</p>

      {error && <p role="alert">{error}</p>}

      <VenueForm
        key={venue.id}
        initialValues={venue}
        onSubmit={handleUpdateVenue}
        isLoading={isSaving}
        submitLabel="Save changes"
      />
    </main>
    );}

export default EditVenuePage;
