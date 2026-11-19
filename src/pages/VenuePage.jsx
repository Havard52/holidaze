import { createBooking } from "../api/bookings";
import { useAuth } from "../context/AuthContext";import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenue } from "../api/venues";
import BookingCalendar from "../components/BookingCalendar";

function VenuePage() {
const { id } = useParams();
const { user, isAuthenticated } = useAuth();
const [guests, setGuests] = useState(1);
const [bookingError, setBookingError] = useState("");
const [bookingSuccess, setBookingSuccess] = useState("");
const [isBooking, setIsBooking] = useState(false);
const [venue, setVenue] = useState(null);

const [selectedDates, setSelectedDates] = useState({
  dateFrom: null,
  dateTo: null,
});

const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");

  useEffect(() => {
    async function loadVenue() {
      try {
        const data = await getVenue(id);
        setVenue(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }}

    loadVenue();
  }, [id]);

  if (isLoading) {
    return <p>Loading venue...</p>;}

  if (error) {
    return <p>{error}</p>;}

  if (!venue) {
    return <p>Venue not found.</p>;}

  const image = venue.media?.[0];


async function handleBooking(event) {
  event.preventDefault();

  setBookingError("");
  setBookingSuccess("");

if (!isAuthenticated) {
  setBookingError("Please log in to make a booking.");
  return;
}

if (!user?.apiKey) {
  setBookingError(
    "Your API key is missing. Please log out and log in again."
  );
  return;
}

  const { dateFrom, dateTo } = selectedDates;

  if (!dateFrom || !dateTo) {
    setBookingError("Please select check-in and check-out dates.");
    return;
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > venue.maxGuests) {
    setBookingError("Please select a valid number of guests.");
    return;
  }

  const bookingData = {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    guests,
    venueId: venue.id,
  };

  setIsBooking(true);

  try {
    await createBooking(
      bookingData,
      user.accessToken,
      user.apiKey
    );

    setBookingSuccess("Congrats!Your booking was created!");
  } catch (error) {
    setBookingError(error.message);
  } finally {
    setIsBooking(false);
  }}


  return (
    <main>
        <Link to="/">← Back to venues</Link>
      <h1>{venue.name}</h1>

      {image && (
        <img
          src={image.url}
          alt={image.alt || venue.name}
        />)}

      <p>{venue.description}</p>

         <p>
        <strong>Price:</strong> {venue.price} NOK per night
         </p>

         <p>
        <strong>Rating:</strong> {venue.rating} / 5
        </p>

      <p>
        <strong>Maximum guests:</strong> {venue.maxGuests}
      </p>

      <BookingCalendar
        bookings={venue.bookings ?? []}
        onDateChange={setSelectedDates}
        />
        
    <section>
    <h2>Book this venue</h2>

    <form onSubmit={handleBooking}>
        <div>
        <label htmlFor="guests">Number of guests</label>
        <input
            id="guests"
            type="number"
            min="1"
            max={venue.maxGuests}
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            required
        />
        </div>

        {selectedDates.dateFrom && selectedDates.dateTo && (
        <p>
            <strong>Total price:</strong>{" "}
            {Math.round(
            (selectedDates.dateTo - selectedDates.dateFrom) /
            (1000 * 60 * 60 * 24)
            ) * venue.price}{" "}
            nok
        </p>)}

        {bookingError && <p role="alert">{bookingError}</p>}
        {bookingSuccess && <p role="status">{bookingSuccess}</p>}

        <button type="submit" disabled={isBooking || Boolean(bookingSuccess)}>
        {isBooking ? "Creating booking..." : "Book now"}
        </button>
    </form>
    </section>

    </main>
  );}

export default VenuePage;