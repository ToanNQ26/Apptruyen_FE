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