import { callApi } from "./base";

export const updateProfile = (userId, data) =>
  callApi(`/auth/users/profile/update/${userId}`, "PUT", data);
