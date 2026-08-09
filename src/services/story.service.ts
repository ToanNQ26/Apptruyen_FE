  import api from './api';
  import type { Story } from '../models/story.model';
  import type { ApiResponse } from '../models/api.respone';
  import type { PaginatedStories } from '../dto/pagination.story';
  import type  { CreateStoryData } from '../dto/CreateStoryData';

  export const getListStory = async (params?: any) => {
    const response = await api.get<ApiResponse<PaginatedStories>>('/stories', { params });
    return response.data;
  };

  export const getStoryBySlug = async (slug: string) => {
    const response = await api.get<ApiResponse<Story>>(`/stories/${slug}`);
    return response.data;
  };

 export const createStory = async (storyData: CreateStoryData) => {
  const formData = new FormData();

  formData.append("title", storyData.title);
  formData.append("author", storyData.author);
  formData.append("description", storyData.description);
  formData.append("storyType", storyData.storyType);
  formData.append("storyLanguage", storyData.storyLanguage);
  formData.append("isColor", String(storyData.isColor));
  formData.append("direction", storyData.direction);
  formData.append("status", storyData.status);

  // Backend sẽ JSON.parse()
  formData.append("genres", JSON.stringify(storyData.genres));
  formData.append("tags", JSON.stringify(storyData.tags));

  // Phải đúng tên "cover" vì backend dùng upload.single("cover")
  formData.append("cover", storyData.cover);

  const response = await api.post("/stories", formData);

  return response.data;
};

  export const updateStory = async (id: string, storyData: Partial<Story>) => {
    const response = await api.put(`/stories/${id}`, storyData);
    return response.data;
  };

  export const deleteStory = async (id: string) => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  };

  export const uploadStoryCover = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await api.post(`/stories/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  };

  export const getMyStories = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await api.get<ApiResponse<PaginatedStories>>('/stories/my', {
    params,
  });

  return response.data;
};
