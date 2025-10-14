import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import useCheckAuthStatus from "@/hooks/useCheckAuthStatus";
import useAdminStore from "@/store/adminStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import fetcher from "@/utils/fetcher";
import { redirect } from "next/navigation";

function ProfileCard() {
  const admin = useAdminStore((s) => s.admin);

  useCheckAuthStatus();

  const handleLogoutUser = async() => {
    await fetcher.post({
      endpointPath: '/admin/logout',
      data: {},
      throwIfError: true,
      onSuccess: () => {
        redirect('/admin/auth/signin')
      },
      fallbackErrorMessage: 'Error logging out',
    })
  }

  const AdminProfile = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/Dhvanitmonpara.png" />
          <AvatarFallback>
            <span className="sr-only">
              {admin?.username.slice(0, 1).toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button onClick={handleLogoutUser} variant="destructive" className="w-full cursor-pointer">
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div>
      {admin ? (
        <AdminProfile />
      ) : (
        <Button variant="secondary" asChild>
          <Link href="/admin/auth/signin">Login</Link>
        </Button>
      )}
    </div>
  );
}

export default ProfileCard;
