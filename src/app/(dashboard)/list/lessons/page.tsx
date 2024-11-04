import FromModels from "@/components/FromModels"; // Import FromModels component
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";

type LessonList = Lesson & { Subject: Subject } & { Class: Class } & {
  Teacher: Teacher;
};

const columns = [
  {
    header: "Subject Name",
    accessor: "subject", // Corrected to use subject for Lesson
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden lg:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "actions",
        },
      ]
    : []),
];

const renderRow = (item: LessonList) => (
  <>
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.Subject.name}</h3>
      </div>
    </td>
    <td>{item.Class.name}</td>
    <td className="hidden md:table-cell">
      {item.Teacher.name + " " + item.Teacher.surname}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === "admin" && (
          <>
            {/* Update button */}
            <FromModels table="lesson" reqType="delete" id={item.id} />{" "}
            <FromModels table="lesson" reqType="update" data={item} />{" "}
            {/* Delete button */}
          </>
        )}
      </div>
    </td>
  </>
);
const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITIONS

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId": {
            query.classId = parseInt(value);
            break;
          }
          case "teacherId": {
            query.teacherId = value;
            break;
          }
          case "search": {
            query.OR = [
              { Subject: { name: { contains: value, mode: "insensitive" } } },
              { Teacher: { name: { contains: value, mode: "insensitive" } } },
            ];
          }
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        Subject: { select: { name: true } },
        Class: { select: { name: true } },
        Teacher: { select: { name: true, surname: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="h-8 w-8 bg-primaryLight flex items-center justify-center rounded-full">
              <CiFilter />
            </button>
            <button className="h-8 w-8 bg-primaryLight flex items-center justify-center rounded-full">
              <FaSort />
            </button>
            {role === "admin" && <FromModels table="lesson" reqType="create" />}
          </div>
        </div>
      </div>
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
      <Pagination page={p} count={count} />
    </div>
  );
};

export default LessonListPage;
