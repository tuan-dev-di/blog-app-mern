import { callApi } from "./base";

export const CREATE_POST = (data) => callApi("/posts/create", "POST", data);

export const GET_POSTS = async (userId, page = 1, limit = 5) => {
  const response = await callApi(
    `/posts/list-post?userId=${userId}&page=${page}&limit=${limit}`,
    "GET"
  );
  return response?.data;
};

export const DELETE_POST = (postId, userId) =>
  callApi(`/posts/delete/${postId}/${userId}`, "DELETE");
