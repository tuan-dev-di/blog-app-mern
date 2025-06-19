import { callApi } from "./base";

export const UPDATE_ACCOUNT = (userId, data) =>
  callApi(`/api/auth/users/account/update/${userId}`, "PUT", data);
export const DELETE_ACCOUNT = (userId, data) =>
  callApi(`/api/auth/users/account/delete/${userId}`, "DELETE", data);

export const GET_USERS = async (userId, page, limit) => {
  const response = await callApi(
    `/api/auth/users/get-users/${userId}?page=${page}&limit=${limit}`,
    "POST"
  );
  return response?.data;
};

export const GET_USERS_OVERVIEW = async (userId, limit) => {
  const response = await callApi(
    `/api/auth/users/get-users/${userId}?limit=${limit}`,
    "POST"
  );
  return response?.data;
};
