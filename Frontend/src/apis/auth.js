import { callApi } from "./base";

export const GOOGLE_AUTH = (data) =>
  callApi("/api/auth/users/google-auth", "POST", data);
export const SIGN_IN = (data) => callApi("/api/auth/users/sign-in", "POST", data);
export const SIGN_UP = (data) => callApi("/api/auth/users/sign-up", "POST", data);
export const SIGN_OUT = (userId) =>
  callApi(`/api/auth/users/sign-out/${userId}`, "POST");
