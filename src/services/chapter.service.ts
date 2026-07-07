import api from "./api";
import type { Chapter } from "../models";
import type { ApiResponse } from "../models/api.respone";

export const getListChapter = async (id: string) =>  {
    const res = await api.get<ApiResponse<Chapter[]>>(`/chapter/story/${id}`);
    return res.data;
}

export const getChapterByChapterNumber = async (slug: string, chapterNumber: string | number) =>  {
    const res = await api.get<ApiResponse<Chapter>>(`/chapter/${slug}/${chapterNumber}`);
    return res.data;
}

export const addChapter = async (storyId: string, chapterNumber: number, title: string | undefined, images: File[]) =>  {
    const formData = new FormData();
    formData.append('storyId', storyId);
    formData.append('chapterNumber', chapterNumber.toString());
    if (title) formData.append('title', title);
    images.forEach((image) => formData.append('images', image));
    const res = await api.post(`/chapter`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
}

export const deleteChapter = async (storyId: string, chapterNumber: string | number) =>  {
    const res = await api.delete<ApiResponse<any>>(`/chapter/${storyId}/${chapterNumber}`);
    return res.data;
}