import { callApi } from "./base";

export const CREATE_COMMENT = (postId, userId, content) =>
  callApi(`/comments/create/${postId}/${userId}`, "POST", { content });
