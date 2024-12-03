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
} from "../ui/hover-card";

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
    label: `Your score`,
    color: "hsl(var(--chart-3))",
  },
};

export function SandW({ classId, clas }: { classId: string }) {
  const userInfo = useSelector((state) => state?.user.userInfo);
  const [chartData, setChartdata] = useState("") as any;
  const [getSW, { data }] = useGetStrengthsAndweaknessesMutation();

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
      subject: clas?.subject,
    });
    setChartdata(v);
  };

  const chartDatas = chartData?.data?.getAggregateScores?.data;

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
        <Card className="bg-slate-50">
          <CardHeader className="pb-4">
            <CardTitle>{clas?.classTitle}</CardTitle>
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
                  <ul className="list-disc ml-8 font-medium" key={index}>
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
          </CardContent>
        </Card>
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>Comparative Performance Chart</CardTitle>
            <CardDescription>2024</CardDescription>
          </CardHeader>
          <CardContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc((100vw-364px)/2)] overflow-x-auto">
            <ChartContainer config={chartConfig} className="min-w-[600px]">
              <BarChart 
                accessibilityLayer 
                data={chartDatas}
                width={600}
                height={300}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={0}
                  axisLine={false}
                  tickFormatter={(value) => value}
                  interval={0}
                  
                  
                 
                  width={300}

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
                  name={`${userInfo?.fullName.split(" ")[0]}'s score`}
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
    </>
  );
}
