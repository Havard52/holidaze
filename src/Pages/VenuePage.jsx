import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVenue } from "../api/venues";

function VenuePage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
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



  return (
    <main>
        <Link to="/">← Back to venues</Link>
      <h1>{venue.name}</h1>

      {image && (
        <img
          src={image.url}
          alt={image.alt || venue.name}
        />
      )}
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
    </main>
  );}

export default VenuePage;