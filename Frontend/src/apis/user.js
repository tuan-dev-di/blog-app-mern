import { callApi } from "./base";

export const UPDATE_ACCOUNT = (userId, data) =>
  callApi(`/auth/users/account/update/${userId}`, "PUT", data);
export const DELETE_ACCOUNT = (userId, data) =>
  callApi(`/auth/users/account/delete/${userId}`, "DELETE", data);
