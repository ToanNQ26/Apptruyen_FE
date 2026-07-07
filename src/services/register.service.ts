import api from "./api";
import type { User } from "../models";

export const Register = async (userData: Omit<User, "_id" | "createdAt" | "updatedAt">) => {
  const response = await api.post("/api/users", userData);
  return response.data;
};