import { callApi } from "./base";

export const CREATE_COMMENT = (postId, userId, content) =>
  callApi(`/comments/create/${postId}/${userId}`, "POST", { content });

export const GET_COMMENTS_IN_POST = async (postId) => {
  const response = await callApi(
    `/comments/get-comments-in-post/${postId}`,
    "GET"
  );
  return response?.data;
};

export const GET_COMMENT_LIST = async (userId, page = 1, limit = 7) => {
  const response = await callApi(
    `/comments/${userId}/get-comments?page=${page}&limit=${limit}`,
    "POST"
  );
  return response?.data;
};

export const UPDATE_COMMENT = (commentId, userId, content) =>
  callApi(`/comments/update/${commentId}/${userId}`, "PUT", {
    content,
  });

export const DELETE_COMMENT = (commentId, userId) =>
  callApi(`/comments/delete/${commentId}/${userId}`, "DELETE");

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

//? ---------------| EXAMPLE |---------------
// export const METHOD_MODEL = async (variable, variable) => {
//   try {
//     const response = await callApi(`/model/method/${variable}/${variable}`, "METHOD");
//     return { ok: true, data: response };
//   } catch (err) {
//     return { ok: false, data: { message: err.message } };
//   }
// };
