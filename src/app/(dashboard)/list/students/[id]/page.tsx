import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import Performance from "@/components/Performance";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdBloodtype, MdDateRange } from "react-icons/md";
import attendance from "../../../../../assets/attendance.png";
import branches from "../../../../../assets/branches.webp";
import classs from "../../../../../assets/class.webp";
import lessons from "../../../../../assets/lessons.webp";
import FormContainer from "@/components/FormContainer";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const student:
    | (Student & {
        Class: Class & { _count: { lesson: number } };
      })
    | null = await prisma.student.findUnique({
    where: { id },
    include: {
      Class: { include: { _count: { select: { lesson: true } } } },
    },
  });

  if (!student) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* TOP */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4 items-center lg:items-start">
            <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
              <Image
                src={student.img || "/noAvatar.webp"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-full lg:w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold text-center lg:text-left">
                {student.name + " " + student.surname}
              </h1>

              {role === "admin" && (
                <FormContainer
                  table="student"
                  reqType="update"
                  data={student}
                />
              )}

              <p className="text-sm text-gray-500 text-center lg:text-left">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex flex-col items-center lg:items-start justify-around lg:justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="flex items-center gap-1">
                  <MdBloodtype />
                  <span>{student.bloodType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdDateRange />
                  <span>January 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <IoIosMail />
                  <span className="break-words">{student.email || "-"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaPhone />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* Small Card Content Here */}
            <div className=" bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={attendance}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <Suspense fallback="Loading...">
                <StudentAttendanceCard id={student.id} />
              </Suspense>
            </div>
            <div className=" bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={branches}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.Class.name.charAt(0)}th
                </h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            <div className=" bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={lessons}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.Class._count.lesson}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            <div className=" bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={classs}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.Class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="bg-white p-4 rounded-md mt-4 h-[800px]">
          <h1>Student&apos;s schedule</h1>
          <BigCalendarContainer type="classId" id={student.Class.id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-2 rounded-md bg-lamaSkyLight"
              href={`/list/lessons?classId=${2}`}
            >
              {" "}
              Student&apos;s Lessons
            </Link>
            <Link
              className="p-2 rounded-md bg-yellow-100"
              href={`/list/teachers?classId=${2}`}
            >
              {" "}
              Student&apos;s Teachers
            </Link>
            <Link
              className="p-2 rounded-md bg-purple-100"
              href={`/list/exams?classId=${2}`}
            >
              {" "}
              Student&apos;s Exams
            </Link>
            <Link
              className="p-2 rounded-md bg-green-100"
              href={`/list/assignments?classId=${2}`}
            >
              {" "}
              Student&apos;s Assignments
            </Link>
            <Link
              className="p-2 rounded-md bg-pink-100"
              href={`/list/results?studentId=${"student1"}`}
            >
              {" "}
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance />
        <Announcement />
        {/* Right Content Here */}
      </div>
    </div>
  );
};

export default SingleStudentPage;
