import api from "./api";



/**
 * =========================
 * TYPES
 * =========================
 */

export type ContributorApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface ContributorUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface ReviewedBy {
  _id: string;
  name: string;
}

export interface ContributorApplication {
  _id: string;
  userId: ContributorUser | string;
  introduction?: string;

  status: ContributorApplicationStatus;

  rejectionReason?: string | null;

  reviewedBy?: ReviewedBy | string | null;

  reviewedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

/**
 * Response pagination từ backend
 */
export interface ContributorApplicationList {
  applications: ContributorApplication[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Query params
 */
export interface GetContributorApplicationsParams {
  page?: number;
  limit?: number;
  status?: ContributorApplicationStatus;
}

/**
 * =========================
 * USER
 * =========================
 */

/**
 * Gửi đơn đăng ký cộng tác viên
 *
 * POST /api/contributor-applications
 */
export const createContributorApplication = (introduction: string) => {
  return api.post("/contributor-applications", {
    introduction,
  });
};

/**
 * Lấy đơn đăng ký của user hiện tại
 *
 * GET /api/contributor-applications/me
 */
export const getMyContributorApplication = async () => {
  const response = await api.get<{
    result: ContributorApplication | null;
  }>("/contributor-applications/me");

  return response.data.result;
};

/**
 * =========================
 * ADMIN
 * =========================
 */

/**
 * Lấy danh sách đơn đăng ký
 *
 * GET /api/contributor-applications
 */
export const getContributorApplications = async (
  params?: GetContributorApplicationsParams,
) => {
  const response = await api.get<{
    result: ContributorApplicationList;
  }>("/contributor-applications", {
    params,
  });

  return response.data.result;
};

/**
 * Lấy chi tiết đơn
 *
 * GET /api/contributor-applications/:id
 */
export const getContributorApplicationById = async (
  id: string,
) => {
  const response = await api.get<{
    result: ContributorApplication;
  }>(`/contributor-applications/${id}`);

  return response.data.result;
};

/**
 * Duyệt đơn
 *
 * PATCH /api/contributor-applications/:id/approve
 */
export const approveContributorApplication = async (
  id: string,
) => {
  const response = await api.patch<{
    result: ContributorApplication;
  }>(`/contributor-applications/${id}/approve`);

  return response.data.result;
};

/**
 * Từ chối đơn
 *
 * PATCH /api/contributor-applications/:id/reject
 */
export const rejectContributorApplication = async (
  id: string,
  reason: string,
) => {
  const response = await api.patch<{
    result: ContributorApplication;
  }>(`/contributor-applications/${id}/reject`, {
    reason,
  });

  return response.data.result;
};

