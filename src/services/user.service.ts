import type { GetUsersParams, GetUsersResponse } from "../dto/UserDTO";
import type { User } from "../models";
import type { ApiResponse } from "../models/api.respone";
import api from "./api";

export const getUserInfo = async () => {
    const response = await api.get<ApiResponse<User>>("/api/users/me");
    return response.data;
}


export const updateUserInfo = async (data:{name:string, email:string}) => {
    const response = await api.put("/api/users/me",data);
    return response.data;
}

export const updatePassword = async (currentPassword: string, newPassword: string) => {
    const response = await api.put("/api/users/password", { currentPassword, newPassword });
    return response.data;
}

export async function getAllUsers(
  params: GetUsersParams = {}
): Promise<GetUsersResponse> {
  const response = await api.get("/api/users", {
    params,
  });

  return response.data.result;
}

export async function updateUserRole(
  userId: string,
  role: "user" | "uploader" | "admin"
) {
  const response = await api.patch<ApiResponse<User>>(`/api/users/role/${userId}`, {
    role,
  });

  return response;
}

export async function deleteUser(
  userId: string,
) {
  const response = await api.delete<ApiResponse<User>>(`/api/users/${userId}`,);

  return response;
}

