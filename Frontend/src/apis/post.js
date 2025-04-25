import { callApi } from "./base";

export const CREATE_POST = (userId, data) =>
  callApi(`/posts/create/${userId}`, "POST", data);
export const UPDATE_POST = (postId, userId, data) =>
  callApi(`/posts/update/${postId}/${userId}`, "PUT", data);

export const GET_POSTS = async (page = 1, limit = 7) => {
  const response = await callApi(
    `/posts/get-posts?page=${page}&limit=${limit}`,
    "GET"
  );
  return response?.data;
};

export const GET_RECENT_POSTS = async (limit = 3) => {
  const response = await callApi(`/posts/get-posts?limit=${limit}`, "GET");
  return response?.data;
};

export const GET_POST_TO_UPDATE = async (postId) => {
  const response = await callApi(`/posts/get-posts?postId=${postId}`, "GET");
  return response?.data;
};

export const GET_POST_DETAIL = async (slug) => {
  const response = await callApi(`/posts/get-posts?slug=${slug}`, "GET");
  return response?.data;
};

export const DELETE_POST = (postId, userId) =>
  callApi(`/posts/delete/${postId}/${userId}`, "DELETE");
