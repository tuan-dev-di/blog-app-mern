import { callApi } from "./base";

export const signIn = (data) => callApi("/auth/users/sign-in", "POST", data);
export const signUp = (data) => callApi("/auth/users/sign-up", "POST", data);
