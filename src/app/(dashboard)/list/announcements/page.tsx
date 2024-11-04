import FromModels from "@/components/FromModels"; // Import FromModels component
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { currentUserId, role } from "@/lib/role";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Announcement, Class, Prisma } from "@prisma/client";
import { CiFilter } from "react-icons/ci";
import { FaSort } from "react-icons/fa";

// Define the type for each announcement
type AnnouncementList = Announcement & { Class: Class };

// Define columns for the announcements table

const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden lg:table-cell", // Hide on smaller screens
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

// Function to render each row of the table
const renderRow = (item: AnnouncementList) => (
  <>
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.title}</h3>
      </div>
    </td>
    <td>{item.Class?.name || "-"}</td>
    <td className="hidden md:table-cell">
      {" "}
      {new Intl.DateTimeFormat("en-US").format(item.date)}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {/* Update button */}
        {role === "admin" && (
          <>
            <FromModels table="announcement" reqType="update" data={item} />
            <FromModels table="announcement" reqType="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </>
);
const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  //URL PARAMS CONDITIONS

  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search": {
            query.title = { contains: value, mode: "insensitive" };
            break;
          }
          default:
            break;
        }
      }
    }
  }

  //ROLE CONDITIONS

  const roleConditions = {
    teacher: { lesson: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    {
      Class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        Class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
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
            {role === "admin" && (
              <FromModels table="announcement" reqType="create" />
            )}
          </div>
        </div>
      </div>
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AnnouncementListPage;
