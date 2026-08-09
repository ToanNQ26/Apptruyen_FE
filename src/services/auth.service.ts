import type { ApiResponse } from '../models/api.respone';
import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}



export const login = async (payload: LoginPayload): Promise<ApiResponse<{ accessToken: string }>> => {
  const  res  = await api.post<ApiResponse<{ accessToken: string }>>('/login',payload);

  return res.data;
};

export const google = async (
    credential: string
): Promise<ApiResponse<{ accessToken: string }>> => {
    const res = await api.post<ApiResponse<{ accessToken: string }>>(
        "/google",
        {credential}
    );

    return res.data;
};


export const logout = async (): Promise<ApiResponse<void>> => {
  const res = await api.post<ApiResponse<void>>("/logout");

  return res.data;
};

