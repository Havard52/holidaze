import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query.trim());}


  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      role="search"
    >
      <label htmlFor="venue-search">
        Search for venues
      </label>

      <div className="search-container">
        <input
          id="venue-search"
          className="search-input"
          type="search"
          placeholder="Find your next destination or venue..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          className="search-button"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );}


export default SearchBar;