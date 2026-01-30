import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext.tsx";

export default function Navbar() {
  const { currentUser, allUsers, switchUser } = useUser();
  return (
    <nav className="flex justify-between items-center shadow-lg sticky top-0 z-10 bg-white w-full p-5 rounded-b-md">
      <header className="font-semibold uppercase text-purple-600 block">
        Interactive Comments
      </header>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">
          Logged in as:{" "}
          <strong className="text-gray-700">{currentUser?.username}</strong>
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full ring-2 ring-purple-100"
            >
              <Avatar>
                <AvatarImage
                  src={currentUser?.avatar}
                  alt={currentUser?.username}
                />
                <AvatarFallback>
                  {currentUser?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
              Switch User
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {allUsers.map((user) => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => switchUser(user)}
                  className="flex gap-2 cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    className="w-6 h-6 rounded-full"
                    alt="user avatar"
                  />
                  <span
                    className={
                      currentUser?.id === user.id
                        ? "font-bold text-purple-600"
                        : ""
                    }
                  >
                    {user.username}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}