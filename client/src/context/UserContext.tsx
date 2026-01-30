import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { getCurrentUser } from "@/service/currentUser.api.ts";

type UserContextType = {
  currentUser: User | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
  });

  return (
    <UserContext.Provider
      value={{ currentUser: currentUser ?? null, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
