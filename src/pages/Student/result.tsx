import { resultColumns } from "@/components/table/columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";

import { DataTable } from "../../components/table/data-table";
import { useGetQuizResultByUserIdQuery } from "../../features/api/apiSlice";

export const Result = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: quizResult, isLoading: quizResultLoading } =
    useGetQuizResultByUserIdQuery(userInfo._id);
  console.log({ q: quizResult });

  return (
    <main>
      {/* <div className="flex items-center justify-between px-4 py-5 rounded-lg bg-background">
        <p className="text-xl font-semibold">Select a subject</p>{" "}
        <Select>
          <SelectTrigger className="w-36 border-foreground/50">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Subjects</SelectLabel>
              
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={resultColumns}
          data={quizResult?.data || []}
          isLoading={quizResultLoading}
        />
      </div>
    </main>
  );
};
