const API_BASE_URL = "https://v2.api.noroff.dev";


export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();


  if (!response.ok) {
    const message =
      result.errors?.map((error) => error.message).join(", ") ||
      "Registration failed. Please try again.";

    throw new Error(message);
  }


  return result.data;
}