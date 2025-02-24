import { callApi } from "./base";

export const createPost = (data) => callApi("/posts/create", "POST", data);

export const getPosts = async (userId, page = 1, limit = 5) => {
  const response = await callApi(
    `/posts/list-post?userId=${userId}&page=${page}&limit=${limit}`,
    "GET"
  );
  return response?.data;
};

export const deletePost = (postId, userId) =>
  callApi(`/posts/delete/${postId}/${userId}`, "DELETE");
