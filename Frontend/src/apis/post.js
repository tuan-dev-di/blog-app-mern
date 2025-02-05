import { callApi } from "./base";

export const createPost = (data) => callApi("/posts/create", "POST", data);
