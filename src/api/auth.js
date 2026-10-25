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

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();


  if (!response.ok) {
    const message =
      result.errors?.map((error) => error.message).join(", ") ||
      "Login failed. Please check your credentials.";

    throw new Error(message);
  }

  return result.data;
}

export async function createApiKey(accessToken) {
  const response = await fetch(
    `${API_BASE_URL}/auth/create-api-key`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: "Holidaze Project Exam",
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    const message =
      result.errors?.map((error) => error.message).join(", ") ||
      "Could not create API key.";

    throw new Error(message);
  }

  return result.data.key;
}
