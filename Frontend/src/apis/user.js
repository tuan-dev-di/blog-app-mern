import { callApi } from "./base";

export const UPDATE_ACCOUNT = (userId, data) =>
  callApi(`/auth/users/account/update/${userId}`, "PUT", data);
export const DELETE_ACCOUNT = (userId, data) =>
  callApi(`/auth/users/account/delete/${userId}`, "DELETE", data);

export const GET_USERS = async (userId, page = 1, limit = 7) => {
  const response = await callApi(
    `/auth/users/get-users/${userId}?page=${page}&limit=${limit}`,
    "POST"
  );
  return response?.data;
};
// export const GET_USERS = async (userId) => {
//   const response = await callApi(`/auth/users/get-users/${userId}`, "POST");
//   return response?.data;
// };
