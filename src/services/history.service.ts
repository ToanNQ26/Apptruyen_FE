import type { HistoryPopulated } from "../dto/historyPopulated";
import type { ApiResponse } from "../models/api.respone";
import api from "./api";

const  getHistoryStory = async ()  => {
    const res = await api.get<ApiResponse<HistoryPopulated[]>>(`/histories`)
    return res.data;
}

const addHistoryStory = async (storyId : string, chapterId : string) => {
    const res = await api.post(`/histories`, {story : storyId, chapter: chapterId})
    return res.data;
}

export {
    getHistoryStory,
    addHistoryStory
}