import { callApi } from "./base";

export const CREATE_POST = (userId, data) =>
  callApi(`/posts/create/${userId}`, "POST", data);
export const UPDATE_POST = (postId, userId, data) =>
  callApi(`/posts/update/${postId}/${userId}`, "PUT", data);

export const GET_POSTS = async (page, limit) => {
  const response = await callApi(
    `/posts/get-posts?page=${page}&limit=${limit}`,
    "GET"
  );
  return response?.data;
};

export const SEARCH_POSTS = async (searchTerm, category, sort) => {
  // const queryParams = new URLSearchParams();

  // if (searchTerm) queryParams.append("searchTerm", searchTerm);
  // if (category) queryParams.append("category", category);
  // if (sort) queryParams.append("sort", sort);

  // const response = await callApi(
  //   `/posts/get-posts?${queryParams.toString()}`,
  //   "GET"
  // );
  // return response?.data;
  const response = await callApi(
    `/posts/get-posts?${searchTerm}&${category}&${sort}`,
    "GET"
  );
  return response?.data;
};

export const GET_POSTS_OVERVIEW = async (limit) => {
  const response = await callApi(`/posts/get-posts?limit=${limit}`, "GET");
  return response?.data;
};

export const GET_RECENT_POSTS = async (limit) => {
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
