import FormContainer from "@/components/FormContainer"; // Import FormContainer component
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { currentUserId, role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";

type ExamList = Exam & {
  Lesson: {
    Subject: Subject;
    Teacher: Teacher;
    Class: Class;
  };
};

const columns = [
  {
    header: "Subject Name",
    accessor: "subject", // Corrected accessor to match the Exam type
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
  {
    header: "Date",
    accessor: "date",
    className: "hidden lg:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "actions",
        },
      ]
    : []),
];

const renderRow = (item: ExamList) => (
  <>
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.Lesson.Subject.name}</h3>
      </div>
    </td>
    <td>{item.Lesson.Class.name}</td>
    <td className="hidden md:table-cell">
      {item.Lesson.Teacher.name + "" + item.Lesson.Teacher.surname}
    </td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            {/* Update button */}
            <FormContainer table="exam" reqType="delete" id={item.id} />{" "}
            <FormContainer table="exam" reqType="update" data={item} />{" "}
            {/* Delete button */}
          </>
        )}
      </div>
    </td>
  </>
);
const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITIONS

  const query: Prisma.ExamWhereInput = {};

  query.Lesson = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.Lesson.classId = parseInt(value);
            break;

          case "teacherId": {
            query.Lesson.teacherId = value;
            break;
          }
          case "search": {
            query.Lesson.Subject = {
              name: { contains: value, mode: "insensitive" },
            };
          }
          default:
            break;
        }
      }
    }
  }

  //ROLE CONDITIONS

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.Lesson.teacherId = currentUserId!;
      break;
    case "student":
      query.Lesson.Class = {
        students: {
          some: {
            id: currentUserId!,
          },
        },
      };
      break;
    case "parent":
      query.Lesson.Class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        Lesson: {
          select: {
            Subject: { select: { name: true } },
            Teacher: { select: { name: true, surname: true } },
            Class: { select: { name: true } },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="h-8 w-8 bg-primaryLight flex items-center justify-center rounded-full">
              <CiFilter />
            </button>
            <button className="h-8 w-8 bg-primaryLight flex items-center justify-center rounded-full">
              <FaSort />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="exam" reqType="create" />
            )}
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

export default ExamListPage;
