import type { User } from "../models";
import type { ApiResponse } from "../models/api.respone";
import api from "./api";

export const getUserInfo = async () => {
    const response = await api.get<ApiResponse<User>>("/api/users/me");
    return response.data;
}
