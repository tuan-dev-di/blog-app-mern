import { callApi } from "./base";

export const updateAccount = (userId, data) =>
  callApi(`/auth/users/account/update/${userId}`, "PUT", data);
export const deleteAccount = (userId, data) =>
  callApi(`/auth/users/account/delete/${userId}`, "DELETE", data);
