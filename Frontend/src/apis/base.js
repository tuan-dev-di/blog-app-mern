const BASE_URL = "/api";

export const callApi = async (endpoint, method = "GET", data = null) => {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) options.body = JSON.stringify(data);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Unknown error occurred");
  }

  const jsonData = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data: jsonData,
  };
};
