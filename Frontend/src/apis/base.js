// import axios from "axios";

const BASE_URL = "/api";

export const callApi = async (endpoint, method = "GET", data = null) => {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

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
    console.log("ERROR:", error.message);

    return {
      ok: false,
      status: 500,
      data: {
        message: error.message,
      },
    };
  }
};

// export const callApi = async (endpoint, method = "GET", data = null) => {
//   try {
//     const response = await axios({
//       url: `${BASE_URL}${endpoint}`,
//       method: method,
//       data,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       timeout: 10000,
//     });

//     return {
//       ok: true,
//       status: response.status,
//       data: response.data,
//     };
//   } catch (error) {
//     console.log("ERROR:", error.message);

//     return {
//       ok: false,
//       status: error.response?.status || 500,
//       data: {
//         message: error.response?.data?.message || "Network Error",
//       },
//     };
//   }
// };
