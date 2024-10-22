import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  User,
  ListPlus,
  Menu,
  Circle,
  StickyNote,
  Users,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Header from "../others/Header";
import { useSelector } from "react-redux";
import { useGetAccountByIdQuery } from "../../features/api/apiSlice";

export function StudentLayout() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data } = useGetAccountByIdQuery(userInfo?.accountId);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-primary md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 fixed text-primary-foreground w-[220px] lg:w-[280px]">
          <div className="flex h-14 items-center border-b lg:h-[60px] border-muted-foreground bg-background">
            <span className="flex px-4  lg:px-6 w-full h-full items-center gap-2 font-semibold bg-muted/40 text-foreground">
              {/* <Circle className="h-6 w-6" /> */}
              <img className="h-8" src="/school.png" />
              <span>{data?.accountName}</span>
            </span>
          </div>
          <div className="flex-1 mt-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink
                end
                to="/student"
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
              <NavLink
                to="/student/result"
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
                to="/student/classrooms"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-muted text-foreground hover:bg-slate-200"
                      : "text-primary-foreground hover:bg-blue-500"
                  }`
                }
              >
                <Users className="h-4 w-4" />
                Classrooms
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-muted text-foreground hover:bg-slate-200"
                      : "text-primary-foreground hover:bg-blue-500"
                  }`
                }
              >
                <User className="h-4 w-4" />
                Profile
              </NavLink>
              <NavLink
                to="/recommendation"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-muted text-foreground hover:bg-slate-200"
                      : "text-primary-foreground hover:bg-blue-500"
                  }`
                }
              >
                <ListPlus className="h-4 w-4" />
                Study Plan
              </NavLink>
              <NavLink
                to="/student/report"
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
              </NavLink>
              {/* <NavLink
                to="/student/under-development"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-muted text-foreground hover:bg-slate-200"
                      : "text-primary-foreground hover:bg-blue-500"
                  }`
                }
              >
                <Settings className="h-4 w-4" />
                Settings
              </NavLink> */}
            </nav>
          </div>
          <div className="mt-auto py-7 text-sm px-5 lg:px-7">
            {/* <button
              className="flex items-center gap-3 rounded-lg py-2 mb-5 hover:bg-blue-500 w-full"
              onClick={() => {
                localStorage.removeItem("Token");
                dispatch(apiSlice.util.resetApiState());
                navigate("/");
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button> */}
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
            <SheetContent
              side="left"
              className="flex flex-col bg-primary text-primary-foreground"
            >
              <nav className="grid gap-2 text-lg font-medium">
                <span className="flex items-center gap-2 text-lg font-semibold">
                  <Circle className="h-6 w-6" />
                  <span className="sr-only">Institution's logo</span>
                  <span>{data?.accountName}</span>
                </span>
                <NavLink
                  end
                  to="/student"
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
                <NavLink
                  to="/student/result"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      isActive
                        ? "bg-muted text-foreground hover:bg-slate-200"
                        : "text-primary-foreground hover:bg-blue-500"
                    }`
                  }
                >
                  <StickyNote className="h-5 w-5" />
                  Result
                </NavLink>
                <NavLink
                  to="/student/classrooms"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      isActive
                        ? "bg-muted text-foreground hover:bg-slate-200"
                        : "text-primary-foreground hover:bg-blue-500"
                    }`
                  }
                >
                  <Users className="h-5 w-5" />
                  Classrooms
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      isActive
                        ? "bg-muted text-foreground hover:bg-slate-200"
                        : "text-primary-foreground hover:bg-blue-500"
                    }`
                  }
                >
                  <User className="h-5 w-5" />
                  Profile
                </NavLink>
                <NavLink
                  to="/recommendation"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      isActive
                        ? "bg-muted text-foreground hover:bg-slate-200"
                        : "text-primary-foreground hover:bg-blue-500"
                    }`
                  }
                >
                  <ListPlus className="h-5 w-5" />
                  Recommendation
                </NavLink>
                <NavLink
                  to="/student/report"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      isActive
                        ? "bg-muted text-foreground hover:bg-slate-200"
                        : "text-primary-foreground hover:bg-blue-500"
                    }`
                  }
                >
                  <LineChart className="h-5 w-5" />
                  Report
                </NavLink>
                {/* <NavLink
                  to="/student/under-development"
                  className={({ isActive }) =>
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
                      isActive
                        ? "bg-muted text-foreground hover:bg-slate-200"
                        : "text-primary-foreground hover:bg-blue-500"
                    }`
                  }
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </NavLink> */}
              </nav>
              <div className="mt-auto px-3">
                <p>EDAT</p>
                <p>All Rights Reserved ©2024</p>
              </div>
            </SheetContent>
          </Sheet>
          <Header />
        </header>
        <main className="flex-1 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
