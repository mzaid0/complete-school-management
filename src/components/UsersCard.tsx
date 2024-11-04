import prisma from "@/lib/prisma";
import React from "react";
import { FaEllipsisV } from "react-icons/fa"; // Importing the ellipsis menu icon

const UsersCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="rounded-xl odd:bg-secondaryLight even:bg-primaryLight p-2 flex-1 min-w-[140px] flex flex-col">
      <div className="flex items-center justify-between ">
        <p className="text-xs  bg-white px-3 py-1 rounded-full text-green-600">
          2024/23
        </p>
        <FaEllipsisV className=" text-white cursor-pointer" size={13} />
      </div>
      <p className="text-2xl font-semibold my-2">{data}</p>
      <p className="capitalize text-sm font-medium text-gray-500">{type}</p>
      {/* Menu icon on the right side */}
    </div>
  );
};

export default UsersCard;
