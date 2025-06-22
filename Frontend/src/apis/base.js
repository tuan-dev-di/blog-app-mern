//? ---------------| CHECK ID & ROLE |---------------
// const BASE_URL = "/api";
const BASE_URL = import.meta.env.VITE_BACKEND_API;

export const callApi = async (endpoint, method = "GET", data = null) => {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  console.log("OPTION:", options.credentials)

  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${BASE_URL}/api${endpoint}`, options);
    // const response = await fetch(`${endpoint}`, options);
    console.log("API:", response);
    console.log("BASE_URL:", BASE_URL);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Unknown error occurred");
    }

    let jsonData;
    try {
      jsonData = await response.json();
    } catch {
      jsonData = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data: jsonData,
    };
  } catch (error) {
    console.log("Base API error:", error.message);

    return {
      ok: false,
      status: 500,
      data: {
        message: error.message,
      },
    };
  }
};
