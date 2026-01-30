import { createContext, useContext, type ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { getAllUsers } from "@/service/users.api.ts";

type UserContextType = {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
  switchUser: (user: User) => void;
};

// REMOVE 'export' here to fix Fast Refresh error
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [_, setVersion] = useState(0); // Simple trigger for re-renders

  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const savedUserId =
    typeof window !== "undefined" ? localStorage.getItem("activeUserId") : null;
  const currentUser =
    allUsers.find((u : User) => u.id === savedUserId) || allUsers[0] || null;

  const switchUser = (user: User) => {
    localStorage.setItem("activeUserId", user.id);
    setVersion((v) => v + 1); // Trigger re-render to pick up new localStorage value
  };

  return (
    <UserContext.Provider
      value={{ currentUser, allUsers, isLoading, switchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
