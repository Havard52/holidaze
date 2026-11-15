import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyVenues } from "../api/venues";
import { getBooking } from "../api/bookings";

function VenueBookingsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [venue, setVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    if (!isAuthenticated || !user?.venueManager || !user?.apiKey) {
      return;
    }


    let active = true;

    async function loadBookings() {
      setIsLoading(true);
      setError("");
      setVenue(null);
      setBookings([]);

      try {
        const venues = await getMyVenues(
          user.name,
          user.accessToken,
          user.apiKey
        );

        const selectedVenue = venues.find(
          (item) => item.id === id
        );

        if (!selectedVenue) {
          throw new Error(
            "Venue not found or access denied."
          );}

        const bookingDetails = await Promise.all(
          (selectedVenue.bookings ?? []).map(
            async (booking) => {
              try {
                return await getBooking(
                  booking.id,
                  user.accessToken,
                  user.apiKey
                );
              } catch {
                return booking;
              }}));

        if (active) {
          setVenue(selectedVenue);
          setBookings(bookingDetails);
        }
      } catch (error) {
        if (active) {
          setError(error.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, [id, user, isAuthenticated]);

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
  }

  function getBookingStatus(booking) {
    const now = new Date();
    const checkIn = new Date(booking.dateFrom);
    const checkOut = new Date(booking.dateTo);

    if (now >= checkOut) {
      return "Completed";
    }
    if (now >= checkIn) {
      return "Ongoing";
    }
    return "Upcoming";
  }

  if (!isAuthenticated || !user?.venueManager || !user?.apiKey) {
    return (
      <main>
        <p>You must be logged in as a venue manager.</p>
        <Link to="/login">Log in</Link>
      </main>
    );
  }

  if (isLoading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return (
      <main>
        <p role="alert">{error}</p>
        <Link to="/manager">Back to dashboard</Link>
      </main>
    );
  }

    if (!venue) {
        return <p>Venue not found</p>;
  }

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
  );

  const upcomingCount = bookings.filter(
    (booking) => getBookingStatus(booking) === "Upcoming"
  ).length;

  const ongoingCount = bookings.filter(
    (booking) => getBookingStatus(booking) === "Ongoing"
  ).length;

        return (
            <main>
            <Link to="/manager">← Back to dashboard</Link>

            <h1>Venue bookings</h1>
            <h2>{venue.name}</h2>

            <div className="booking-summary">
                <div>
          <h3>Total bookings</h3>
          <p>{bookings.length}</p>
        </div>

        <div>
          <h3>Upcoming</h3>
          <p>{upcomingCount}</p>
        </div>

            <div>
            <h3>Ongoing</h3>
            <p>{ongoingCount}</p>
            </div>
      </div>

      {bookings.length === 0 ? (
        <p>This venue has no bookings yet.</p>
      ) : (
        <div className="booking-table-wrapper">
          <table className="booking-table">
            <caption>All bookings for {venue.name}</caption>

                <thead>
                <tr>
                    <th scope="col">Customer</th>
                    <th scope="col">Check-in</th>
                    <th scope="col">Check-out</th>
                    <th scope="col">Guests</th>
                    <th scope="col">Status</th>
                </tr>
                </thead>

            <tbody>
              {sortedBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    {booking.customer?.name ||
                      "Customer unavailable"}
                  </td>

                    <td>{formatDate(booking.dateFrom)}</td>

                    <td>{formatDate(booking.dateTo)}</td>

                    <td>{booking.guests}</td>

                    <td>
                    <span
                      className={`booking-status ${getBookingStatus(
                        booking
                      ).toLowerCase()}`}
                    >
                      {getBookingStatus(booking)}
                    </span>
                  </td>
                    </tr>
              ))}
             </tbody>
          </table>
        </div>
      )}
    </main>
  );}

export default VenueBookingsPage;
