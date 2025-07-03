//? ---------------| CHECK ID & ROLE |---------------
const BASE_URL = "/api";
// const BASE_URL = import.meta.env.VITE_BACKEND_API;

export const callApi = async (
  endpoint,
  method = "GET",
  data = null,
  isFormData = false
) => {
  const options = {
    method,
    headers: {},
    credentials: "include",
  };

  if (data) {
    if (isFormData) {
      options.body = data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    // const response = await fetch(`${BASE_URL}/api${endpoint}`, options);

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
