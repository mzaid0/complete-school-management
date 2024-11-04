import FromModels from "@/components/FromModels"; // Import FromModels component
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { currentUserId } from "@/lib/role";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";

type ResultList = {
  id: number;
  title: string;
  studentName: string;
  studentSurname: string;
  teacherName: string;
  teacherSurname: string;
  score: number;
  className: string;
  startTime: Date;
};

const columns = [
  {
    header: "Title",
    accessor: "title", // Corrected accessor to match the Result type
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden lg:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden lg:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
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

const renderRow = (item: ResultList) => (
  <>
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.title}</h3>
      </div>
    </td>
    <td>{item.studentName + "" + item.studentSurname}</td>
    <td className="hidden md:table-cell">{item.score}</td>
    <td className="hidden md:table-cell">
      {item.teacherName + "" + item.teacherSurname}
    </td>
    <td className="hidden md:table-cell">{item.className}</td>
    <td className="hidden md:table-cell">
      {" "}
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {/* Update button */}
        {(role === "admin" || role === "teacher") && (
          <>
            <FromModels table="result" reqType="update" data={item} />
            <FromModels table="result" reqType="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </>
);
const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITIONS

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId": {
            query.studentId = value;
            break;
          }
          case "search": {
            query.OR = [
              { Exam: { title: { contains: value, mode: "insensitive" } } },
              { Student: { name: { contains: value, mode: "insensitive" } } },
            ];
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
      query.OR = [
        { Exam: { Lesson: { teacherId: currentUserId } } },
        { Assignment: { Lesson: { teacherId: currentUserId } } },
      ];
      break;

    case "student":
      query.studentId = currentUserId;
      break;

    case "parent":
      query.Student = {
        parentId: currentUserId,
      };
      break;

    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        Student: { select: { name: true, surname: true } },
        Exam: {
          include: {
            Lesson: {
              select: {
                Class: { select: { name: true } },
                Teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        Assignment: {
          include: {
            Lesson: {
              select: {
                Class: { select: { name: true } },
                Teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({
      where: query,
    }),
  ]);

  const data = dataRes.map((item) => {
    const assessment = item.Exam || item.Assignment;
    if (!assessment) return null;

    const isExam = "startTime" in assessment;

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.Student?.name,
      studentSurname: item.Student?.surname,
      teacherName: assessment.Lesson?.Teacher?.name,
      teacherSurname: assessment.Lesson?.Teacher?.surname,
      score: item.score,
      className: assessment.Lesson?.Class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
    };
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
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
              <FromModels table="result" reqType="create" />
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

export default ResultListPage;
