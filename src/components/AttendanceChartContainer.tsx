import { FaEllipsisV } from "react-icons/fa";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Use getDay() to get the correct weekday (0 = Sunday, 6 = Saturday)
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date); // Convert the date correctly
    const day = itemDate.getDay(); // Get the day number (0 = Sunday, 6 = Saturday)

    if (day >= 1 && day <= 5) {
      // Only map weekdays (Mon-Fri)
      const dayName = daysOfWeek[day - 1]; // Correct day mapping from the daysOfWeek array
      if (item.present) {
        attendanceMap[dayName].present += 1; // Increment present count
      } else {
        attendanceMap[dayName].absent += 1; // Increment absent count
      }
    }
  });

  console.log(attendanceMap);

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="p-4 h-full bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <FaEllipsisV className=" text-black cursor-pointer" size={13} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
