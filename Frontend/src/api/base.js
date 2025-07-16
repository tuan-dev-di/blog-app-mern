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
    let response = await fetch(`${BASE_URL}${endpoint}`, options);
    // let response = await fetch(`${BASE_URL}/api${endpoint}`, options);

    // if (response.status === 401 && retry)
    console.log("RESPONSE STATUS:", response.status);

    if (!response.ok) {
      const error = await response.json();
      // const errorMsg = error?.message || "Unknown error";

      // if (
      //   response.status === 401 ||
      //   errorMsg.includes("Token expired") ||
      //   errorMsg.includes("Invalid token")
      // ) {
      //   store.dispatch(signOutSuccess());
      //   return {
      //     success: true,
      //     status: 401,
      //     data: {
      //       message:
      //         "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!",
      //     },
      //   };
      // }

      throw new Error(error);
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
