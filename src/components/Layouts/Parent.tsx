import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Settings,
  Home,
  User,
  Users,
  LineChart,
  Menu,
  Circle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Header from "../others/Header";

export function ParentsLayout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-primary md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 fixed text-primary-foreground w-[220px] lg:w-[280px]">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Circle className="h-6 w-6" />
              {/* <img className="h-8" src="edat_logo.png" /> */}
              <span>Institution's logo</span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink
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
            </nav>
          </div>
          <div className="mt-auto py-7 text-sm px-5 lg:px-7">
            <p>EDAT</p>
            <p>All Rights Reserved ©2024</p>
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
                    `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${
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
