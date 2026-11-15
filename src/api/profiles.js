
const API_BASE_URL = "https://v2.api.noroff.dev";

export async function updateProfile(
  name,
  profileData,
  accessToken,
  apiKey
) {
    
  const response = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify(profileData),
    });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.errors?.map((error) => error.message).join(", ") ||
        "Could not update profile."
    );}

  return result.data;
}
