import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dumbbell, OctagonAlert } from "lucide-react";
import {
  Bar,
  BarChart,
  Legend,
  Tooltip,
  CartesianGrid,
  XAxis,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toTitleCase } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import {
  useGetChildResultQuery,
  useGetChildSandWMutation,
} from "@/features/api/apiSlice";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  country: {
    label: "Country Average",
    color: "hsl(var(--chart-1))",
  },
  class: {
    label: "Class Average",
    color: "hsl(var(--chart-2))",
  },
  student: {
    label: "Student Score",
    color: "hsl(var(--chart-3))",
  },
};

export default function Strengths() {
  const [chartData, setChartdata] = useState("") as any;
  const { childId } = useParams();
  const [classId, setClassId] = useState("");
  const { data: childClassrooms, isLoading: classroomsLoading } = useGetChildResultQuery(childId);
  const [getSW, { data, isLoading: swLoading }] = useGetChildSandWMutation();

  useEffect(() => {
    if (classId) {
      sw();
    }
  }, [classId]);

  let clas: any;
  if (classId) {
    clas = childClassrooms?.data?.classRoomData?.filter((i) => classId === i._id)[0];
  }

  const sw = async () => {
    const v = await getSW({
      classId,
      userId: childId,
      subject: clas?.classRoomName.split("_")[3],
    });
    setChartdata(v);
  };

  const chartDatas = chartData?.data?.getAggregateScores?.data;

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
      <div className="w-full flex justify-end">
        <Select onValueChange={setClassId}>
          <SelectTrigger className="w-[180px] bg-orange-500 text-white">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Classrooms</SelectLabel>
              {childClassrooms?.data?.classRoomData?.map((i) => (
                <SelectItem value={i._id} key={i._id}>
                  {i?.classRoomName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {!classId ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[350px] max-h-[350px] text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to your child's Performance Analysis</h2>
          <p className="text-gray-600 mb-6 text-lg text-start">Please select a subject from the dropdown above to view detailed performance metrics</p>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 w-full">
            <p className="text-gray-700 mb-3 font-medium">You'll be able to see:</p>
            <ul className="text-gray-600 space-y-2 list-none">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Child's Strengths and Weaknesses
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                Child's Areas needing Improvement
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                Child's Performance across the country
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Child's Performance within a class and subject
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Comparative Performance Chart
              </li>
            </ul>
          </div>
        </div>
      ) : swLoading ? (
        <div className="flex items-center justify-center flex-1 min-h-[400px]">
          <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-gray-700 font-medium">Loading performance data...</p>
            <p className="text-gray-500 text-sm">This may take a few moments</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
          <Card className="bg-slate-50">
            <CardHeader className="pb-4">
             
            </CardHeader>
            <CardContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc((100vw-364px)/2)] overflow-x-hidden grid sm:grid-cols-2 gap-6 sm:gap-3 pt-8">
              <div className="">
                <span className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Dumbbell />
                  </span>
                  <h4 className="text-xl font-medium">Strengths</h4>
                </span>
                <div className="space-y-3 mt-3">
                  {data?.SW?.strengths.map((i, index: number) => (
                    <div key={index}>
                      <ul className="list-disc ml-8 font-medium">
                       
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <li className="truncate cursor-pointer">
                              {toTitleCase(i?.objective_name || "")}
                            </li>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="flex justify-between space-x-4">
                              {toTitleCase(i?.objective_name || "")}
                            </p>
                            <p className="text-sm font-light">
                              Your score:{" "}
                              <span className="font-normal">
                                {(i?.score).toFixed(0)}%
                              </span>
                            </p>
                            <p className="text-sm font-light">
                              Top{" "}
                              <span className="font-normal">
                                {Math.round(i?.national_percentile_rank)}%
                              </span>{" "}
                              of students in the country
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                        <p className="text-sm font-light">
                          Your score:{" "}
                          <span className="font-normal">
                            {(i?.score).toFixed(0)}%
                          </span>
                        </p>
                        <p className="text-sm font-light">
                          Top{" "}
                          <span className="font-normal">
                            {Math.round(i?.national_percentile_rank)}%
                          </span>{" "}
                          of students in the country
                        </p>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="">
                <span className="grid grid-flow-col justify-start items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <OctagonAlert />
                  </span>
                  <h4 className="text-xl font-medium truncate">
                    Areas of Improvements
                  </h4>
                </span>
                <div className="space-y-3 mt-3">
                  {data?.SW?.weaknesses.map((i, index: number) => (
                    <div key={index}>
                      <ul className="list-disc ml-8 font-medium">
                       
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <li className="truncate cursor-pointer">
                              {toTitleCase(i?.objective_name || "")}
                            </li>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="flex justify-between space-x-4">
                              {toTitleCase(i?.objective_name || "")}
                            </p>
                            <p className="text-sm font-light">
                              Your score -
                              <span className="font-normal">
                                {(i?.score).toFixed(0)}%
                              </span>
                            </p>
                            <p className="text-sm font-light">
                              Top{" "}
                              <span className="font-normal">
                                {Math.round(i?.national_percentile_rank)}%
                              </span>{" "}
                              of students in the country
                            </p>
                          </HoverCardContent>
                        </HoverCard>
                        <p className="text-sm font-light">
                          Your score:{" "}
                          <span className="font-normal">
                            {(i?.score).toFixed(0)}%
                          </span>
                        </p>
                        <p className="text-sm font-light">
                          Top{" "}
                          <span className="font-normal">
                            {Math.round(i?.national_percentile_rank)}%
                          </span>{" "}
                          of students in the country
                        </p>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle>Comparative Performance Chart</CardTitle>
              <CardDescription>2024</CardDescription>
            </CardHeader>
            <CardContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc((100vw-364px)/2)] overflow-x-auto">
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartDatas}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Legend wrapperStyle={{ bottom: -10 }} />
                  <Bar
                    dataKey="student"
                    fill="var(--color-student)"
                    radius={4}
                    name="Student Score"
                  />
                  <Bar
                    dataKey="class"
                    fill="var(--color-class)"
                    radius={4}
                    name="Class Average"
                  />
                  <Bar
                    dataKey="country"
                    fill="var(--color-country)"
                    radius={4}
                    name="Country Average"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            
          </Card>
          
        </div>
      )}
    </div>
  );
}
