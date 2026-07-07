import api from "./api";
import type { ApiResponse } from "../models/api.respone";
import type { PaginatedStories } from "../dto/pagination.story";

type CheckFollowResponse = {
    isFollowed: boolean;
};

export const followStory = async (
    storyId: string
) => {
    const res = await api.post<ApiResponse<any>>("/follows",{ storyId });

    return res.data;
};

export const unfollowStory = async (
    storyId: string
) => {

    const res = await api.delete<
        ApiResponse<any>
    >(
        `/follows/${storyId}`
    );

    return res.data;
};

export const checkFollow = async (
    storyId: string
) => {

    const res = await api.get<
        ApiResponse<CheckFollowResponse>
    >(
        `/follows/check/${storyId}`
    );

    return res.data;
};

export const getUserFollows = async (
    page = 1,
    limit = 10
) => {

    const res = await api.get<
        ApiResponse<PaginatedStories>
    >(
        "/follows",
        {
            params: {
                page,
                limit,
            },
        }
    );

    return res.data;
};

export const getStoryFollowers = async (
    storyId: string,
    page = 1,
    limit = 10
) => {

    const res = await api.get<
        ApiResponse<any>
    >(
        `/follows/story/${storyId}`,
        {
            params: {
                page,
                limit,
            },
        }
    );

    return res.data;
};