
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
