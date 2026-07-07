import type { ApiResponse } from '../models/api.respone';
import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}



export const login = async (payload: LoginPayload): Promise<ApiResponse<{ token: string }>> => {
  const  res  = await api.post<ApiResponse<{ token: string }>>('/login',payload);

  return res.data;
};