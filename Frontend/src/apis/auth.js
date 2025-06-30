import { callApi } from "./base";

// AUTHENTICATION FOR USER WHEN LOGGING IN
export const GOOGLE_AUTH = (data) =>
  callApi("/auth/users/google-auth", "POST", data);
export const SIGN_IN = (data) => callApi("/auth/users/sign-in", "POST", data);
export const SIGN_UP = (data) => callApi("/auth/users/sign-up", "POST", data);
export const SIGN_OUT = (userId) =>
  callApi(`/auth/users/sign-out/${userId}`, "POST");

// AUTHENTICATION FOR UPLOADING IMAGE
export const UPLOAD_IMAGE = async (formData) => {
  const response = await callApi("/images/upload", "POST", formData, true);
  return response?.data;
};
