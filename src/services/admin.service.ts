import api from "./api";

export interface WeeklyStat {
  date: string;
  count: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalStories: number;
  totalChapters: number;
  totalContributors: number;
  pendingApplications: number;
  totalViews: number;

  storyStats: WeeklyStat[];
  viewStats: WeeklyStat[];
}

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard");

  return res.data;
};