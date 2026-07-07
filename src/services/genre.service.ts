import api from './api';
import type { Genre } from '../models';
import type { ApiResponse } from '../models/api.respone';

export const getAllGenres = async () => {
  const response = await api.get<ApiResponse<Genre[]>>('/genres');
  return response.data;
};

export const getGenreById = async (id: string) => {
  const response = await api.get(`/genres/${id}`);
  return response.data;
};

export const createGenre = async (genreData: Partial<Genre>) => {
  const response = await api.post('/api/genres', genreData);
  return response.data;
};

export const updateGenre = async (id: string, genreData: Partial<Genre>) => {
  const response = await api.put(`/api/genres/${id}`, genreData);
  return response.data;
};

export const deleteGenre = async (id: string) => {
  const response = await api.delete(`/api/genres/${id}`);
  return response.data;
};
