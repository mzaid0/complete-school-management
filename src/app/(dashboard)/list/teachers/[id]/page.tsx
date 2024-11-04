import Announcement from "@/components/Announcement";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
// import { role } from "@/lib/role";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { auth } from "@clerk/nextjs/server";
import { Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaPhone } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdBloodtype, MdDateRange } from "react-icons/md";
import attendance from "../../../../../assets/attendance.png";
import branches from "../../../../../assets/branches.webp";
import classs from "../../../../../assets/class.webp";
import lessons from "../../../../../assets/lessons.webp";

const SingleTeacherPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const teacher:
    | (Teacher & {
        _count: { subjects: number; lesson: number; classes: number };
      })
    | null = await prisma.teacher.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subjects: true,
          lesson: true,
          classes: true,
        },
      },
    },
  });

  if (!teacher) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {/* TOP SECTION */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* TEACHER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4 items-center lg:items-start">
            <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
              <Image
                src={teacher.img || "/noAvatar.webp"}
                alt="Teacher's Image"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-full lg:w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold text-center lg:text-left">
                {`${teacher.name} ${teacher.surname}`}
              </h1>
              {role === "admin" && (
                <FormContainer
                  table="teacher"
                  reqType="update"
                  data={teacher}
                />
              )}
              <p className="text-sm text-gray-500 text-center lg:text-left">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex flex-col items-center lg:items-start gap-2 text-xs font-medium">
                <div className="flex items-center gap-1">
                  <MdBloodtype />
                  <span>{teacher.bloodType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdDateRange />
                  <span>January 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <IoIosMail />
                  <span className="break-words">{teacher.email || "-"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaPhone />
                  <span>{teacher.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* STATS CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* Card: Attendance */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]">
              <Image
                src={attendance}
                alt="Attendance Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* Card: Branches */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]">
              <Image
                src={branches}
                alt="Branches Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.subjects}
                </h1>
                <span className="text-sm text-gray-400">Branches</span>
              </div>
            </div>
            {/* Card: Lessons */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]">
              <Image
                src={lessons}
                alt="Lessons Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.lesson}
                </h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            {/* Card: Classes */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%]">
              <Image
                src={classs}
                alt="Classes Icon"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div>
                <h1 className="text-xl font-semibold">
                  {teacher._count.classes}
                </h1>
                <span className="text-sm text-gray-400">Classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Schedule */}
        <div className="bg-white p-4 rounded-md mt-4 h-[800px]">
          <h1>Teacher&apos;s Schedule</h1>
          <BigCalendarContainer type="teacherId" id={teacher.id} />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* Shortcuts */}
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-2 rounded-md bg-lamaSkyLight"
              href={`/list/classes?supervisorId=${teacher.id}`}
            >
              Teacher&apos;s Classes
            </Link>
            <Link
              className="p-2 rounded-md bg-yellow-100"
              href={`/list/students?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Students
            </Link>
            <Link
              className="p-2 rounded-md bg-pink-100"
              href={`/list/lessons?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Lessons
            </Link>
            <Link
              className="p-2 rounded-md bg-purple-100"
              href={`/list/exams?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Exams
            </Link>
            <Link
              className="p-2 rounded-md bg-green-100"
              href={`/list/assignments?teacherId=${teacher.id}`}
            >
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>

        {/* Performance */}
        <Performance />

        {/* Announcements */}
        <Announcement />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
