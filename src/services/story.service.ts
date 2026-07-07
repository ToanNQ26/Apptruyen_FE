  import api from './api';
  import type { Story } from '../models/story.model';
  import type { ApiResponse } from '../models/api.respone';
  import type { PaginatedStories } from '../dto/pagination.story';

  export const getListStory = async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedStories>>('/stories', { params });
    return response.data;
  };

  export const getStoryBySlug = async (slug: string) => {
    const response = await api.get<ApiResponse<Story>>(`/stories/${slug}`);
    return response.data;
  };

  export const createStory = async (storyData: Partial<Story>) => {
    const response = await api.post('/api/stories', storyData);
    return response.data;
  };

  export const updateStory = async (id: string, storyData: Partial<Story>) => {
    const response = await api.put(`/api/stories/${id}`, storyData);
    return response.data;
  };

  export const deleteStory = async (id: string) => {
    const response = await api.delete(`/api/stories/${id}`);
    return response.data;
  };

  export const uploadStoryCover = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await api.post(`/api/stories/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };
