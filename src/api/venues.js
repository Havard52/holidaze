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
  const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`);
  if (!response.ok) {
    throw new Error("Could not fetch venue");
  }
  const result = await response.json();

  return result.data;
}