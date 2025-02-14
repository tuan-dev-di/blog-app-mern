import { callApi } from "./base";

export const createPost = (data) => callApi("/posts/create", "POST", data);
export const getPosts = (userId) =>
  callApi(`/posts/list-post?userId=${userId}`, "GET", userId);
