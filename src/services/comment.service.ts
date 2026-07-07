import api from "./api";
import type { ApiResponse } from "../models/api.respone";
import type { Comment } from "../models/comment.model";

// Lấy tất cả comment
export const getAllComments = async () => {
  const response = await api.get<ApiResponse<Comment[]>>("/comments");

  return response.data;
};

// Lấy comment theo id
export const getCommentById = async (id: string) => {
  const response = await api.get<ApiResponse<Comment>>(`/comments/${id}`);

  return response.data;
};

// Tạo comment
export const createComment = async (data: Partial<Comment>) => {
  const response = await api.post<ApiResponse<Comment>>(
    "/comments",
    data
  );

  return response.data;
};

// Cập nhật comment
export const updateComment = async (
  id: string,
  data: Partial<Comment>
) => {
  const response = await api.put<ApiResponse<Comment>>(
    `/comments/${id}`,
    data
  );

  return response.data;
};

// Xóa comment
export const deleteComment = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(
    `/comments/${id}`
  );

  return response.data;
};