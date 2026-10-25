
import { useState } from "react";

function BookingCalendar({ bookings = [], onDateChange }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [error, setError] = useState("");
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isBooked(date) {
    return bookings.some((booking) => {
      const start = new Date(booking.dateFrom);
      const end = new Date(booking.dateTo);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return date >= start && date < end;
    });}

  function hasBookingConflict(start, end) {
    return bookings.some((booking) => {
      const bookedStart = new Date(booking.dateFrom);
      const bookedEnd = new Date(booking.dateTo);

      bookedStart.setHours(0, 0, 0, 0);
      bookedEnd.setHours(0, 0, 0, 0);

      return start < bookedEnd && end > bookedStart;
    });}

  function handleDateClick(date) {
    setError("");

    if (date < today || isBooked(date)) {
      return;}

    if (!checkIn || checkOut || date <= checkIn) {
      setCheckIn(date);
      setCheckOut(null);
      onDateChange?.({ dateFrom: date, dateTo: null });
      return;}

    if (hasBookingConflict(checkIn, date)) {
      setError("These dates include an existing booking.");
      return;}

    setCheckOut(date);
    onDateChange?.({ dateFrom: checkIn, dateTo: date });}

  function changeMonth(amount) {
    setCurrentMonth(new Date(year, month + amount, 1));}

  function formatDate(date) {
    return date?.toLocaleDateString("en-GB") || "Not selected";}

  const days = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1);

  return (
    <section aria-labelledby="availability-heading">
      <h2 id="availability-heading">Please select your dates</h2>

      <div className="calendar-navigation">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={
            year === today.getFullYear() &&
            month === today.getMonth()
          }
        >
          Previous
        </button>

        <h3>
          {currentMonth.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button type="button" onClick={() => changeMonth(1)}>
          Next
        </button>
      </div>

      <div className="calendar-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (day) => (
            <strong key={day}>{day}</strong>
          )
        )}

        {Array.from({ length: startOffset }, (_, index) => (
          <span key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const date = new Date(year, month, day);
          const booked = isBooked(date);
          const past = date < today;

          const selectedStart =
            checkIn?.getTime() === date.getTime();

          const selectedEnd =
            checkOut?.getTime() === date.getTime();

          const inRange =
            checkIn &&
            checkOut &&
            date > checkIn &&
            date < checkOut;

          return (
            <button
              key={day}
              type="button"
              disabled={past || booked}
              onClick={() => handleDateClick(date)}
              className={`calendar-day ${
                booked ? "booked" : ""
              } ${past ? "past" : ""} ${
                selectedStart || selectedEnd ? "selected" : ""
              } ${inRange ? "in-range" : ""}`}
              aria-label={`${date.toLocaleDateString("en-GB")}: ${
                past
                  ? "Past date"
                  : booked
                    ? "Booked"
                    : "Available"}`}

              aria-pressed={Boolean(selectedStart || selectedEnd)}
            >
              {day}
            </button>);})}
      </div>

      <div className="booking-selection">
        <p><strong>Check-in:</strong> {formatDate(checkIn)}</p>
        <p><strong>Check-out:</strong> {formatDate(checkOut)}</p>
      </div>

      {error && <p role="alert">{error}</p>}
    </section>
  );}

export default BookingCalendar;
