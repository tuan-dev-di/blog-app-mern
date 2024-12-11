import { callApi } from "./base";

export const googleAuth = (data) =>
  callApi("/auth/users/google-auth", "POST", data);

export const signIn = (data) => callApi("/auth/users/sign-in", "POST", data);
export const signUp = (data) => callApi("/auth/users/sign-up", "POST", data);
