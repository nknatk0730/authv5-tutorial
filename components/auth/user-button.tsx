'use client';

import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

export const UserButton = () => {
  const { user } = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="flex items-center justify-center bg-sky-500">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <LogoutButton>
          <DropdownMenuItem>
              <ExitIcon className="h-4 w-4 mr-2" />
              Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};