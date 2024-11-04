"use client";
import { BiMaleFemale } from "react-icons/bi";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "white",
    },
    {
      name: "Girls",
      count: girls,
      fill: "#f1ee8e",
    },
    {
      name: "Boys",
      count: boys,
      fill: "hsl(200, 100%, 85%)",
    },
  ];
  return (
    <div className="h-[75%] w-full relative">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Gender Icon in the center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <BiMaleFemale className="text-gray-300" size={40} />
      </div>
    </div>
  );
};

export default CountChart;
