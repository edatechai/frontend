import { Bell, BookText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import {
  apiSlice,
  useGetAllNotificationsByUserIdQuery,
  useMarkNotificationAsReadMutation,
} from "../../features/api/apiSlice";
import { ModeToggle } from "./mode-toggle";
import { getInitialsFromFullName } from "@/lib/utils";

const Header = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useGetAllNotificationsByUserIdQuery(userInfo?._id);
  const [markAsRead] = useMarkNotificationAsReadMutation();
  console.log({ data });

  const unreadNotifications = data?.filter((val) => val.status == "unread");

  return (
    <>
      <span className="w-full flex-1">{/* <ModeToggle /> */}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="relative">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full uppercase text-muted-foreground"
            >
              <Bell className="size-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
            {unreadNotifications?.length ? (
              <span className="size-4 bg-destructive text-destructive-foreground rounded-full absolute flex items-center justify-center top-0 left-7 text-xs">
                {unreadNotifications?.length}
              </span>
            ) : (
              ""
            )}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {unreadNotifications?.length
              ? "Notifications"
              : "No new notification"}
          </DropdownMenuLabel>
          {!!unreadNotifications?.length && <DropdownMenuSeparator />}
          {!!unreadNotifications?.length &&
            unreadNotifications?.map((val, index: number) => (
              <DropdownMenu key={index}>
                <button
                  className="items-center gap-2 grid grid-flow-col justify-start text-left hover:bg-border w-full mb-2 py-1 pr-2 rounded"
                  onClick={() =>
                    markAsRead({
                      userId: userInfo._id,
                      notificationId: val.id,
                    })
                  }
                >
                  <span className="size-8 rounded-full border border-border flex items-center justify-center">
                    <BookText className="size-5 text-muted-foreground" />
                  </span>
                  <span>
                    <p className="font-medium">{val?.title}</p>
                    <p>{val?.message}</p>
                  </span>
                </button>
                {/* <p className="self-end ml-2 !justify-self-end">View Quiz</p> */}
              </DropdownMenu>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full uppercase text-muted-foreground"
          >
            {/* <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
            {getInitialsFromFullName(userInfo?.fullName)}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{userInfo?.fullName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{userInfo.email}</DropdownMenuItem>
          {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
          {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
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
