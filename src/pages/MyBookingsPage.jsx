
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyBookings } from "../api/bookings";

function MyBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user?.apiKey) {
      return;
    }

    let active = true;

    async function loadBookings() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getMyBookings(
          user.name,
          user.accessToken,
          user.apiKey
        );

        if (active) {
          setBookings(data);
        }
      } catch (error) {
        if (active) {
          setError(error.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }}}

    loadBookings();

    return () => {
      active = false;
    };
  }, [user, isAuthenticated]);

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
  }

  if (!isAuthenticated || !user?.apiKey) {
    return (
      <main>
        <h1>My bookings</h1>
        <p>Please log in to view your bookings.</p>
        <Link to="/login">Log in</Link>
      </main>
    );
  }

  if (isLoading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings
    .filter((booking) => new Date(booking.dateTo) > today)
    .sort(
      (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
    );

  return (
    <main>
      <h1>My bookings</h1>
      <p>View your upcoming stays.</p>

      {upcomingBookings.length === 0 ?(
        <div>
          <p>You have no upcoming bookings.</p>
          <Link to="/">Explore venues</Link>
        </div>
      ):(
        <div className="booking-grid">
          {upcomingBookings.map((booking) => {
            const venue = booking.venue;
            const image = venue?.media?.[0];

            return (
              <article
                className="booking-card"
                key={booking.id}
              >
                {image && (
                  <img
                    src={image.url}
                    alt={image.alt || venue.name}
                  />
                )}

                <div className="booking-card-content">
                  <h2>{venue?.name || "Venue unavailable"}</h2>

                  <p>
                    <strong>Check-in:</strong>{" "}
                    {formatDate(booking.dateFrom)}
                  </p>

                  <p>
                    <strong>Check-out:</strong>{" "}
                    {formatDate(booking.dateTo)}
                  </p>

                  <p>
                    <strong>Guests:</strong> {booking.guests}
                  </p>

                  {venue && (
                    <Link to={`/venues/${venue.id}`}>
                      View venue
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );}

export default MyBookingsPage;
