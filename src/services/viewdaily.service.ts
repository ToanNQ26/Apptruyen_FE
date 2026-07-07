import api from "./api";
import type { ApiResponse } from "../models/api.respone";
import type { Story } from "../models/story.model";

export const increaseView = async (storyId: string) => {
  const response = await api.post<ApiResponse<null>>(
    `/views/${storyId}/view`
  );

  return response.data;
};

export const getTopDaily = async (limit = 20) => {
  const response = await api.get<ApiResponse<Story[]>>(
    "/views/ranking/day",
    {
      params: { limit },
    }
  );

  return response.data;
};

export const getTopWeekly = async (limit = 20) => {
  const response = await api.get<ApiResponse<Story[]>>(
    "/views/ranking/week",
    {
      params: { limit },
    }
  );

  return response.data;
};

export const getTopMonthly = async (limit = 20) => {
  const response = await api.get<ApiResponse<Story[]>>(
    "/views/ranking/month",
    {
      params: { limit },
    }
  );

  return response.data;
};