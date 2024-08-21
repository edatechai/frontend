import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetStrengthsAndweaknessesMutation } from "../../features/api/apiSlice";
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
  ChartConfig,
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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "../ui/button";

const cData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { name: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  country: {
    label: "National Average",
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
} satisfies ChartConfig;

export function SandW({
  classId,
  classTitle,
}: {
  classId: string;
  classTitle: string;
}) {
  const userInfo = useSelector((state) => state?.user.userInfo);
  const [chartData, setChartdata] = useState("") as any;
  const [getSW, { data, isLoading, isError, isSuccess }] =
    useGetStrengthsAndweaknessesMutation();

  useEffect(() => {
    if (classId) {
      sw();
    }
  }, [classId]);

  const sw = async () => {
    const v = await getSW({
      classId,
      objCode: "",
      accountId: userInfo?.accountId,
      topic: "",
      category: "",
      userId: userInfo?._id,
    });
    setChartdata(v);
  };

  //console.log("here d.data.aggData.chartData)

  const chartDatas = chartData?.data?.getAggregateScores?.data;
  //   console.log("new", chartData?.classScores?.classScore);

  // const newdata = [
  //   { name: 'Class',  score : chartData?.classScores.classScore },
  //   { name: 'Student', score : chartData?.studentScores.studentScore },
  //   { name: 'Country', score : chartData?.countryScores.countryScore }
  // ];

  // const newdata = [
  //   { name: `${userInfo?.fullName}`, sales: chartData?.studentScores.studentScore },
  //   { name: `Class Ave`, sales: chartData?.classScores.classScore},
  //   { name: `Country Ave`, sales: chartData?.countryScores.countryScore},

  // ];

  return (
    <>
      {/* {data?.SW?.strengths.length || data?.SW?.weaknesses.length ? (
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader className="px-6 py-3">
            <CardTitle className="text-lg">{classTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-1 flex-col w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-hidden">
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
              <Card x-chunk="dashboard-01-chunk-5" className="flex flex-col">
                <CardHeader className="px-6 py-3">
                  <CardTitle className="text-lg flex gap-1 items-center">
                    <BadgeCheck />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-flow-col gap-4 flex-1 w-[calc(100vw-80px)] md:w-[calc(100vw-300px)] lg:w-[calc((100vw-412px)/2)] overflow-auto">
                  {data?.SW?.strengths.map((i, index) => (
                    <Card
                      x-chunk="dashboard-01-chunk-5"
                      className="flex flex-col w-64"
                    >
                      <CardHeader className="px-6 py-3 flex-1">
                        <CardTitle className="text-lg capitalize line-clamp-2">
                          {i?.objective_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex gap-4 flex-1 flex-col">
                        <div className="text-2xl font-bold">{i?.score}%</div>
                        <p className="text-sm text-muted-foreground">
                          National Percentile Rank-{" "}
                          {Math.round(i?.national_percentile_rank)}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Class Rank-
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-5" className="flex flex-col">
                <CardHeader className="px-6 py-3">
                  <CardTitle className="text-lg flex gap-1 items-center">
                    <OctagonAlert />
                    Areas of Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-flow-col gap-4 flex-1 w-[calc(100vw-80px)] md:w-[calc(100vw-300px)] lg:w-[calc((100vw-412px)/2)] overflow-auto">
                  {data?.SW?.weaknesses.map((i, index) => (
                    <Card
                      x-chunk="dashboard-01-chunk-5"
                      className="flex flex-col w-64"
                      key={index}
                    >
                      <CardHeader className="px-6 py-3 flex-1">
                        <CardTitle className="text-lg capitalize line-clamp-2">
                          {i?.objective_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex gap-4 flex-1 flex-col">
                        <div className="text-2xl font-bold">{i?.score}%</div>
                        <p className="text-sm text-muted-foreground">
                          National Percentile Rank-{" "}
                          {Math.round(i?.national_percentile_rank)}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Class Rank-
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p>No Strenths or area of improvement</p>
      )} */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
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
                  //   tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Legend className="mt-4" />
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
          {/* <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter> */}
        </Card>
        <Card className="bg-slate-50">
          <CardHeader className="pb-4">
            <CardTitle>{classTitle}</CardTitle>
            <CardDescription>
              More infomation about this topic on the curriculum.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc((100vw-364px)/2)] overflow-x-auto grid sm:grid-cols-2 gap-6 sm:gap-3 pt-8">
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
                      <li className="truncate">{i?.objective_name}</li>
                      <p className="text-sm font-light">
                        National Percentile Rank -{" "}
                        {Math.round(i?.national_percentile_rank)}%
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
                      <li className="truncate">{i?.objective_name}</li>
                      <p className="text-sm font-light">
                        National Percentile Rank -{" "}
                        {Math.round(i?.national_percentile_rank)}%
                      </p>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="items-center pb-4">
            <CardTitle>Radar Chart</CardTitle>
            <CardDescription>2024</CardDescription>
          </CardHeader>
          <CardContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc((100vw-364px)/2)] overflow-x-auto p-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadarChart data={chartDatas}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="name" />
                <PolarGrid />
                <Legend />
                <Radar
                  dataKey="country"
                  fill="var(--color-country)"
                  fillOpacity={0.6}
                />
                <Radar dataKey="class" fill="var(--color-class)" />
                <Radar dataKey="student" fill="var(--color-student)" />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card> */}
      </div>
    </>
  );
}
