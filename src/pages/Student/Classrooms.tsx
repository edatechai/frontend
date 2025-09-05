import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFindMyClassesQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
//import { JoinClassroom } from "../../components/classroom/JoinClassroom";
import { JoinClassroom } from "../../components/classroom/joinClassroom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



type RootState = { user: { userInfo: { _id: string } | null } };
type ClassItem = {
  _id: string;
  classTitle?: string;
  numberOfStudents?: Array<unknown>;
};

export function StudentClassrooms() {
  const userInfo = useSelector((state: RootState) => state.user.userInfo) as { _id: string };
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const { data: myClasses, isLoading, isFetching } = useFindMyClassesQuery({ id: userInfo._id, page, limit });

  const total = myClasses?.pagination?.total || 0;
  const pages = myClasses?.pagination?.pages || 1;
  const current = myClasses?.pagination?.page || page;
  const startIdx = total === 0 ? 0 : (current - 1) * limit + 1;
  const endIdx = Math.min(total, current * limit);

  const pageItems = useMemo(() => {
    const totalPages = Math.max(1, pages);
    const curr = Math.min(Math.max(1, current), totalPages);
    const delta = 1; // how many pages around current
    const range: (number | string)[] = [];
    const left = Math.max(1, curr - delta);
    const right = Math.min(totalPages, curr + delta);
    const withEdges = new Set<number>([1, totalPages, left - 1, right + 1, left, right, curr - 2, curr - 1, curr, curr + 1, curr + 2]);
    const sorted = [...withEdges]
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
    let last = 0;
    for (const n of sorted) {
      if (last && n - last > 1) range.push("…");
      range.push(n);
      last = n;
    }
    return range;
  }, [pages, current]);

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
      <JoinClassroom userInfo={userInfo} />
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Classrooms</CardTitle>
        </CardHeader>
        {myClasses?.classes?.length ? (
          <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {(myClasses?.classes as ClassItem[] | undefined)?.map((val: ClassItem, i: number) => (
              <Card
                x-chunk="dashboard-01-chunk-0"
                key={i}
                className="flex flex-col justify-between"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {val?.classTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-5">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>{val?.numberOfStudents?.length}</div>
                  </span>
                  <Link
                    to={`/student/classrooms/${val?._id}`}
                    className="text-primary hover:underline text-sm font-semibold"
                  >
                    View Class
                  </Link>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        ) : (
          <>
            {isLoading || isFetching ? (
              <p className="ml-6 mb-5">Loading…</p>
            ) : (
              <p className="ml-6 mb-5">You do not belong to any class yet</p>
            )}
          </>
        )}
      </Card>
      <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm opacity-80">
          Showing {startIdx}-{endIdx} of {total}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={isLoading || isFetching || current === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={isLoading || isFetching || current === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageItems.map((p, idx) => (
            typeof p === "number" ? (
              <Button
                key={idx}
                variant={p === current ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                disabled={isLoading || isFetching}
              >
                {p}
              </Button>
            ) : (
              <span key={idx} className="px-2 select-none opacity-70">{p}</span>
            )
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoading || isFetching || current >= pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(pages)}
            disabled={isLoading || isFetching || current >= pages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          {/* <div className="ml-2" />
          <Select
            value={String(limit)}
            onValueChange={(val) => { setPage(1); setLimit(parseInt(val)); }}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              {[8, 12, 16, 24].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>
    </div>
  );
}
