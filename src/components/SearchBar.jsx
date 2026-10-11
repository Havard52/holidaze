import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query.trim());}

  return (
    <form onSubmit={handleSubmit} role="search">
      <label htmlFor="venue-search">
        Search for venues
      </label>


      <input
        id="venue-search"
        type="search"
        placeholder="Find your nesxt destinations or venues now."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />


      <button type="submit">Search</button>
    </form>
  );}

export default SearchBar;