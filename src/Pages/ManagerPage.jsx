import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyVenues } from "../api/venues";

function ManagerPage() {
  const { user, isAuthenticated } = useAuth();

  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (!isAuthenticated) {
    return (
      <main>
        <p>Please log in to access the dashboard.</p>
        <Link to="/login">Log in</Link>
      </main>
    );}

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
      <p>Manage your venues and bookings.</p>

      <Link className="primary-link" to="/manager/create">
        Create new venue
      </Link>

      <h2>My venues</h2>

      {isLoading && <p>Loading your venues...</p>}

      {error && <p role="alert">{error}</p>}

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

              <Link to={`/venues/${venue.id}`}>
                View venue
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );}

export default ManagerPage;
