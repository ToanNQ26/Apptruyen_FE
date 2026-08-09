
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "uploader" | "admin";
  followingCount: number;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "user" | "uploader" | "admin" | "";
}

export interface GetUsersResponse {
  users: User[];
  pagination: UserPagination;
}



