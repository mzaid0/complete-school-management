import Link from "next/link";
import { FaEllipsisV } from "react-icons/fa";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;
  return (
    <div className="relative bg-white rounded-lg w-full h-full p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">Students</p>
        <Link href="#">
          <FaEllipsisV className="text-black cursor-pointer" size={13} />
        </Link>
      </div>

      {/* Chart Component */}
      <CountChart boys={boys} girls={girls} />

      {/* Boys and Girls Count Section */}
      <div className="flex justify-center gap-16 ">
        <div className="flex flex-col items-center gap-1">
          <div className="h-5 w-5 rounded-full bg-lamaSky" />
          <h1 className="font-bold">{boys}</h1>
          <p className="text-xs text-gray-400">
            Boys {Math.round((boys / (boys + girls)) * 100)} %
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="h-5 w-5 rounded-full bg-[#f1ee8e]" />
          <h1 className="font-bold">{girls}</h1>
          <p className="text-xs text-gray-400">
            Girls {Math.round((girls / (boys + girls)) * 100)} %
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
