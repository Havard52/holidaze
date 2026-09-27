import { Link } from "react-router-dom";

function VenueCard({ venue }) {
  const image = venue.media?.[0];

  return (
    <article>
      {image && (
        <img
          src={image.url}
          alt={image.alt || venue.name}
        />
      )}
      <h3>{venue.name}</h3>

      <p>
        <strong>Price:</strong> {venue.price} NOK per night
      </p>

      <p>
        <strong>Rating:</strong> {venue.rating} / 5
      </p>

      <Link to={`/venues/${venue.id}`}>
        View venue
      </Link>
    </article>
  );}

export default VenueCard;