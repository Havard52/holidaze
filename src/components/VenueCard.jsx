function VenueCard({ venue}) {
  return (
    <article>
      <h3>{venue.name}</h3>

      <p>{venue.description}</p>

      <p>
        <strong>Price:</strong> {venue.price} NOK per night
      </p>
    </article>
  );}

export default VenueCard;