import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LineChart,
  Menu,
  Circle,
  Dumbbell,
  StickyNote,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Header from "../others/Header";
import {
  useGetAccountByIdQuery,
  useGetAllChildrenQuery,
} from "@/features/api/apiSlice";

export function ParentsLayout() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: children, isLoading } = useGetAllChildrenQuery(
    userInfo?.childrenArray
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data } = useGetAccountByIdQuery(userInfo.accountId);
  const [wardId, setWardId] = useState<string | null>(null);

  useEffect(() => {
    if (children?.length == 1) {
      setWardId(children[0].user._id);
    }
  }, [children]);

  useEffect(() => {
    if (wardId == null) {
      navigate("/parent");
    }
    if (pathname.startsWith("/parent/result")) {
      navigate(`/parent/result/${wardId}`);
    }
    if (pathname.startsWith("/parent/strengths")) {
      navigate(`/parent/strengths/${wardId}`);
    }
  }, [wardId]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-primary md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 fixed text-primary-foreground w-[220px] lg:w-[280px]">
          <div className="flex h-14 items-center border-b lg:h-[60px] border-muted-foreground bg-background">
            <span className="flex px-4  lg:px-6 w-full h-full items-center gap-2 font-semibold bg-muted/40 text-foreground">
              {/* <Circle className="h-6 w-6" /> */}
              <img className="h-8" src="school.png" />
              <span>{data?.accountName}</span>
            </span>
          </div>
          <div className="flex-1 mt-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink
                end
                to="/parent"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-muted text-foreground hover:bg-slate-200"
                      : "text-primary-foreground hover:bg-blue-500"
                  }`
                }
              >
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>
              {/* <NavLink
                to="/parent/report"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-muted text-foreground hover:bg-slate-200"
                      : "text-primary-foreground hover:bg-blue-500"
                  }`
                }
              >
                <LineChart className="h-4 w-4" />
                Report
              </NavLink> */}
              {!!wardId && (
                <>
                  <NavLink
                    to={`/parent/result/${wardId}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive
                          ? "bg-muted text-foreground hover:bg-slate-200"
                          : "text-primary-foreground hover:bg-blue-500"
                      }`
                    }
                  >
                    <StickyNote className="h-4 w-4" />
                    Result
                  </NavLink>
                  <NavLink
                    to={`/parent/strengths/${wardId}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        isActive
                          ? "bg-muted text-foreground hover:bg-slate-200"
                          : "text-primary-foreground hover:bg-blue-500"
                      }`
                    }
                  >
                    <Dumbbell className="h-4 w-4" />
                    Strengths
                  </NavLink>
                </>
              )}
            </nav>
          </div>
          <div className="mt-auto py-7 text-sm px-5 lg:px-7">
            {children?.length > 1 && (
              <Select onValueChange={(e) => setWardId(e)}>
                <SelectTrigger className="bg-primary text-primary-foreground mb-5">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Children</SelectLabel>
                    {children?.map(({ user }) => (
                      <SelectItem value={user?._id} key={user?._id}>
                        {user?.fullName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <span className="flex gap-2 text-xs items-center">
              <img alt="" src="/edat_logo.png" className="w-12" />
              <p>All Rights Reserved ©2024</p>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Circle className="h-6 w-6" />
                  <span className="sr-only">Institution's Logo</span>
                </div>
                <NavLink
                  to="/parent"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 mt-4 ${
                      isActive
                        ? "bg-muted text-foreground hover:bg-slate-200"
                        : "text-primary-foreground hover:bg-blue-500"
                    }`
                  }
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </NavLink>
              </nav>
              <div className="mt-auto px-3">
                {/* <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select> */}
                <p>EDAT</p>
                <p>All Rights Reserved ©2024</p>
              </div>
            </SheetContent>
          </Sheet>
          {/* header here */}
          <Header />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
