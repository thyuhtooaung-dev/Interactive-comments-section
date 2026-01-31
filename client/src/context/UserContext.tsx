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

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [, setVersion] = useState(0);

  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const allUsers: User[] = data || [];
  const savedUserId =
    typeof window !== "undefined" ? localStorage.getItem("activeUserId") : null;

  const currentUser =
    allUsers.length > 0
      ? allUsers.find((u: User) => u.id === savedUserId) || allUsers[0]
      : null;

  const switchUser = (user: User) => {
    localStorage.setItem("activeUserId", user.id);
    setVersion((v) => v + 1);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        switchUser,
      }}
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
