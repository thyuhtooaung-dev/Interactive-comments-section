import api from "@/service/axios.ts";
import type { User } from "@/types";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(`/users/`);
  return response.data;
};