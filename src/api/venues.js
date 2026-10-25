const API_BASE_URL = "https://v2.api.noroff.dev";

export async function getVenues() {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues`);
  if (!response.ok) {
    throw new Error("Could not fetch venues");
  }

  const result = await response.json();
  return result.data;
}

export async function getVenue(id) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/venues/${encodeURIComponent(id)}?_bookings=true`);

  if (!response.ok) {
    throw new Error("Could not fetch venue");}

  const result = await response.json();
  return result.data;
}

export async function searchVenues(query){
      const response = await fetch(
    `${API_BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(query)}`
   );

  if (!response.ok) {
    throw new Error("Could not search the venues");
 }

  const result = await response.json();
  return result.data;
}