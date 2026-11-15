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


export async function getMyVenues(name, accessToken, apiKey) {
  const venues = [];
  let page = 1;

  do {
    const response = await fetch(
      `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}/venues?_bookings=true&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },});

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message ||
          "Could not fetch your venues."
      );}

    venues.push(...result.data);
    page = result.meta?.nextPage;
  } while (page);

  return venues;
}

export async function createVenue(venueData, accessToken, apiKey) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/venues`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(venueData),
    });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.errors?.map((error) => error.message).join(", ") ||
        "Could not create venue."
    );}

  return result.data;
}

//update venue

export async function updateVenue(
  id,
  venueData,
  accessToken,
  apiKey
) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/venues/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(venueData),
    });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.errors?.map((error) => error.message).join(", ") ||
        "Could not update venue."
    );}

  return result.data;
}

//delete venue

export async function deleteVenue(id, accessToken, apiKey) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/venues/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },});

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.errors?.map((error) => error.message).join(", ") ||
        "Could not delete venue."
    );}}
