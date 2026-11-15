const API_BASE_URL = "https://v2.api.noroff.dev";

export async function createBooking(bookingData, accessToken, apiKey) {
  const response = await fetch(`${API_BASE_URL}/holidaze/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify(bookingData),
  });

  const result = await response.json();

  
  if (!response.ok) {
    const message =
      result.errors?.map((error) => error.message).join(", ") ||
      "Could not create booking.";

    throw new Error(message);
  }

  return result.data;}


export async function getMyBookings(name, accessToken, apiKey) {
  const bookings = [];
  let page = 1;

  do {
    const response = await fetch(
      `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}/bookings?_venue=true&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message ||
          "Could not fetch bookings."
      );}

    bookings.push(...result.data);
    page = result.meta?.nextPage;
  } while (page);

  return bookings;
}

export async function getBooking(id, accessToken, apiKey) {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/bookings/${encodeURIComponent(id)}?_customer=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },   });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors?.[0]?.message ||
          "Could not fetch booking."
      );}

  return result.data;
}

