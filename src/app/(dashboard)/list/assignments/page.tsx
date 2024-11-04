import FromModels from "@/components/FromModels"; // Import FromModels component
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/role";
import prisma from "@/lib/prisma";
import { currentUserId } from "@/lib/role"; // Ensure currentUserId is correctly imported
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";

type AssignmentList = Assignment & {
  Lesson: {
    Subject: Subject;
    Teacher: Teacher;
    Class: Class;
  };
};

// Table column definitions
const columns = [
  {
    header: "Subject Name",
    accessor: "subject",
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
    header: "Due Date",
    accessor: "dueDate",
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

// Row rendering logic
const renderRow = (item: AssignmentList) => (
  <>
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.Lesson.Subject.name}</h3>
      </div>
    </td>
    <td>{item.Lesson.Class.name}</td>
    <td className="hidden md:table-cell">
      {item.Lesson.Teacher.name + " " + item.Lesson.Teacher.surname}
    </td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.dueDate)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {/* Update and Delete buttons */}
        {(role === "admin" || role === "teacher") && (
          <>
            <FromModels table="assignment" reqType="delete" id={item.id} />
            <FromModels table="assignment" reqType="update" data={item} />
          </>
        )}
      </div>
    </td>
  </>
);

const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Initialize query
  const query: Prisma.AssignmentWhereInput = {};
  query.Lesson = {};

  // URL parameters filtering logic
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.Lesson.classId = parseInt(value);
            break;
          case "teacherId":
            query.Lesson.teacherId = value;
            break;
          case "search":
            query.Lesson.Subject = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // Role-based filtering logic
  switch (role) {
    case "admin":
      // Admin can see all assignments
      break;
    case "teacher":
      // Filter by the current teacher's ID
      if (currentUserId) {
        query.Lesson.teacherId = currentUserId; // Ensure only the current teacher's assignments are shown
      } else {
        console.error("Current User ID not found");
      }
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
      // Optionally restrict data for other roles
      query.Lesson.teacherId = null; // No assignments for other roles
      break;
  }

  // Fetch data from Prisma
  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
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
    prisma.assignment.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Assignments
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="h-8 w-8 bg-primaryLight flex items-center justify-center rounded-full">
              <CiFilter />
            </button>
            <button className="h-8 w-8 bg-primaryLight flex items-center justify-center rounded-full">
              <FaSort />
            </button>
            {role === "admin" ||
              (role === "teacher" && (
                <FromModels table="assignment" reqType="create" />
              ))}
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

export default AssignmentListPage;
