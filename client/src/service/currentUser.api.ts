import api from "@/service/axios.ts";
import type { User } from "@/types";

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>(`/users/me`);
  return response.data;
};