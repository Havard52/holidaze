import VenueCard from "../components/VenueCard";
import {useEffect, useState}  from "react";
import {getVenues} from "../api/venues";

function HomePage() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect (() => {
    async function loadVenues() {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadVenues();
  }, []);

  if (isLoading) {
    return <p>Loading venues...</p>;
   }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <section>
      <h1>Find your next stay</h1>
      <p>Discover new places to stay on Holidazeee.</p>
      </section>

      <section>
        <h2>Venues</h2>

{venues.map((venue) => (
  <VenueCard key={venue.id} venue={venue} />
))}

      </section>
    </main>
  );
}

export default HomePage;