import { callApi } from "./base";

export const CREATE_COMMENT = (postId, userId, content) =>
  callApi(`/comments/create/${postId}/${userId}`, "POST", { content });

export const GET_COMMENTS = async (postId) => {
  const response = await callApi(`/comments/get-comments/${postId}`, "GET");
  return response?.data;
};

export const GET_USER = async (userId) => {
  const response = await callApi(`/auth/users/${userId}`, "GET");
  return response?.data?.rest;
};

export const LIKE_COMMENT = async (commentId, userId) => {
  const response = await callApi(
    `/comments/like-comment/${commentId}/${userId}`,
    "PUT"
  );
  return response?.data?.comment;
};
