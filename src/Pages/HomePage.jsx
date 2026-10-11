import { useEffect, useState } from "react";
import { getVenues, searchVenues } from "../api/venues";
import VenueCard from "../components/VenueCard";
import SearchBar from "../components/SearchBar";

function HomePage() {
  const [venues, setVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadVenues() {
      setIsLoading(true);
      setError("");

      
      try {
        const data = searchQuery
          ? await searchVenues(searchQuery)
          : await getVenues();

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
        }
      }
    }


    loadVenues();
    return () => {
      active = false;
    };
  }, [searchQuery]);


  return (
    <main>
      <section>
        <h1>Find your next stay</h1>
        <p>Discover places to stay with Holidaze.</p>

        <SearchBar onSearch={setSearchQuery} />
      </section>

      <section>
        <h2>
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Venues"}
        </h2>

        {isLoading && <p>Loading venues...</p>}

        {error && <p role="alert">{error}</p>}

        {!isLoading && !error && venues.length === 0 && (
          <p>Sorry, No venues found. Please try another search.</p>
        )}

        {!isLoading && !error && venues.length > 0 && (
          <div className="venue-grid">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </main>
 );}

export default HomePage;