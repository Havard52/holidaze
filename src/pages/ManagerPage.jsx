import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyVenues, deleteVenue } from "../api/venues";

function ManagerPage() {
  const { user, isAuthenticated } = useAuth();

  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState("");


  useEffect(() => {
    if (!isAuthenticated || !user?.venueManager || !user?.apiKey) {
      return;
    }
    let active = true;

    async function loadVenues() {
      setIsLoading(true);
      setError("");

         try {
        const data = await getMyVenues(
          user.name,
          user.accessToken,
          user.apiKey
        );

        if (active) {
          setVenues(data);
        }
      } catch (error) {
        if (active) {
          setError(error.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }}}

    loadVenues();

    return () => {
      active = false;
    };
  }, [user, isAuthenticated]);


  // Delete venue

  async function handleDeleteVenue(venue) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${venue.name}"?`
    );

    if (!confirmed) {
      return;
}

    setError("");
    setSuccess("");
    setDeletingId(venue.id);

    try {
      await deleteVenue(
        venue.id,
        user.accessToken,
        user.apiKey
      );

      setVenues((previousVenues) =>
        previousVenues.filter(
          (item) => item.id !== venue.id
        ));

      setSuccess("Venue deleted successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }}

    //access check

  if (!isAuthenticated) {
    return (
      <main>
        <p>Please log in to access the dashboard</p>
        <Link to="/login">Log in</Link>
      </main>
    );
  }

  if (!user.venueManager) {
    return (
      <main>
        <p>You must be a venue manager to access this page.</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  if (!user.apiKey) {
    return <p>Please log out and log in again.</p>;
  }


  return (
    <main>
      <h1>Venue Manager Dashboard</h1>
      <p>Manage your venues and bookings</p>

      <Link className="primary-link" to="/manager/create">
        Create new venue
      </Link>

      <h2>My venues</h2>

      {isLoading && <p>Loading your venues...</p>}

      {error && <p role="alert">{error}</p>}

      {success && (
    <p className="success-message" role="status">
    {success}
    </p>
)}

      {!isLoading && !error && venues.length === 0 && (
        <p>You have not created any venues yet.</p>
      )}

      <div className="manager-grid">
        {venues.map((venue) => (
          <article className="manager-card" key={venue.id}>
            {venue.media?.[0] && (
              <img
                src={venue.media[0].url}
                alt={venue.media[0].alt || venue.name}
              />
            )}

            <div className="manager-card-content">
              <h3>{venue.name}</h3>
              <p>{venue.price} NOK per night</p>
              <p>Maximum guests: {venue.maxGuests}</p>
              <p>Bookings: {venue.bookings?.length ?? 0}</p>


                <div className="manager-actions">
                <Link to={`/venues/${venue.id}`}>
                    View venue
                </Link>

                <Link to={`/manager/edit/${venue.id}`}>
                    Edit venue
                </Link>

                <Link to={`/manager/bookings/${venue.id}`}>
                    View bookings
                </Link>

                <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteVenue(venue)}
                    disabled={deletingId !== null}
                >
                    {deletingId === venue.id
                    ? "Deleting..."
                    : "Delete venue"}
                </button>
                </div>

            </div>
          </article>
        ))}
      </div>
    </main>
  );}

export default ManagerPage;
