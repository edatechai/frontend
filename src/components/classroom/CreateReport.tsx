import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { useGenerateStudentReportMutation } from "@/features/api/apiSlice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    if (id == "fullName") {
      return <span className="capitalize">{value as string}</span>;
    } else {
      return (
        <Input
          className="out-of-range:border-red-600"
          type="number"
          required
          min="0"
          max="10"
          value={value as string}
          onChange={(e) => {
            setValue(+e.target.value);
          }}
          onBlur={onBlur}
        />
      );
    }
  },
};

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

export default function CreateReport() {
  let {
    state: { studentData },
  } = useLocation();

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: () => <span>Full Name</span>,
      },
      {
        accessorKey: "attendance",
        header: () => <span>Attendance</span>,
      },
      {
        accessorKey: "attitude_rating",
        header: () => <span>Attitude to Learning</span>,
      },
      {
        accessorKey: "behaviour",
        header: () => <span>Behaviour</span>,
      },
    ],
    []
  );

  //   const studentData = [
  //     {
  //       _id: "66a687d64c92cafaed484ace",
  //       fullName: "hope oboite",
  //       username: "hope2024",
  //       __v: 0,
  //     },
  //   ];

  const [generateStudentsReport, { isLoading, isError, data: reportData }] =
    useGenerateStudentReportMutation();

  const [data, setData] = useState(() => makeData(studentData));

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  const handleSubmit = async () => {
    //   try {
    const response = await generateStudentsReport(data).unwrap();
    console.log(response);
    //     if (response.status) {
    //       dialogRef.current.close();
    //       return alert(response.message);
    //     }
    //     alert(response.message);
    //     dialogRef.current.close();
    //   } catch (error) {
    //     console.log(error);
    //   }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/teacher">Classrooms</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/teacher/class">Students</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Report</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <form className="p-2" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-2xl mb-6 font-medium">Create Students Report</h1>
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
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Button
          type="submit"
          onClick={() => handleSubmit()}
          disabled={isLoading}
          className="mt-6 float-right"
        >
          Create Report
        </Button>
      </form>
    </>
  );
}
