import { useState } from "react";
import {
  ColumnDef,
  // ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


interface ServerPagingProps {
  page: number;
  pages: number;
  total?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  pageSize?: number;
  noData?: string;
  serverPaging?: ServerPagingProps;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  noData = "Nothing to show",
  isLoading = false,
  isError = false,
  error = null,
  serverPaging,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: serverPaging ? Math.max(0, (serverPaging.page || 1) - 1) : 0,
    pageSize: serverPaging ? serverPaging.pageSize : pageSize,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="w-full">
      {pageSize > 6 && (
        <div className="flex items-center py-4 gap-4">
        
        </div>
      )}
      <div className="border">
        <Table>
          <TableHeader className="bg-primary text-primary-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-white hover:bg-primary"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-sm">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-background hover:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : noData}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4 px-2 text-sm">
          <div className="flex items-center gap-2 opacity-80">
            {isLoading && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span aria-live="polite" className="sr-only">Loading…</span>
              </>
            )}
            {serverPaging ? (
              <span>
                Page <strong>{serverPaging.page}</strong> of <strong>{serverPaging.pages}</strong>
                {typeof serverPaging.total === 'number' && (
                  <span> · Total {serverPaging.total}</span>
                )}
              </span>
            ) : (
              <span>
                Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of <strong>{table.getPageCount().toLocaleString()}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              Rows per page:
              <select
                className="p-2 mx-2 rounded bg-white border border-border hover:bg-accent"
                value={serverPaging ? serverPaging.pageSize : table.getState().pagination.pageSize}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (serverPaging) {
                    serverPaging.onPageSizeChange(n);
                  } else {
                    table.setPageSize(n);
                  }
                }}
                disabled={isLoading}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n} className="bg-white m-0">{n}</option>
                ))}
              </select>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (serverPaging ? serverPaging.onPageChange(1) : table.firstPage())}
              disabled={serverPaging ? (!serverPaging.hasPrev || isLoading) : !table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (serverPaging ? serverPaging.onPageChange(Math.max(1, serverPaging.page - 1)) : table.previousPage())}
              disabled={serverPaging ? (!serverPaging.hasPrev || isLoading) : !table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (serverPaging ? serverPaging.onPageChange(serverPaging.page + 1) : table.nextPage())}
              disabled={serverPaging ? (!serverPaging.hasNext || isLoading) : !table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (serverPaging ? serverPaging.onPageChange(serverPaging.pages) : table.lastPage())}
              disabled={serverPaging ? (!serverPaging.hasNext || isLoading) : !table.getCanNextPage()}
            >
              {">>"}
            </Button>
            {isLoading && (
              <span className="flex items-center gap-2 pl-2 text-muted-foreground">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Loading...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
