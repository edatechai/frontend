import React from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { apiSlice, useGetAccountByIdQuery } from "../../features/api/apiSlice";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("userr info", userInfo);
  const { data, error, isLoading } = useGetAccountByIdQuery(userInfo.accountId);

  return (
    <>
      <span className="w-full flex-1">
        <ModeToggle />
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            {/* <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              className="h-5 w-5"
            /> */}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userInfo?.fullName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{userInfo.email}</DropdownMenuItem>
          <DropdownMenuItem className="justify-between">
            Profile
            <span className="badge">New</span>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              localStorage.removeItem("Token");
              dispatch(apiSlice.util.resetApiState());
              // window.location.href = "/";
              navigate("/");
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Header;
