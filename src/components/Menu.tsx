import Link from "next/link";
import React from "react";
import {
  FaHome,
  FaUserGraduate,
  FaUser,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
  FaEnvelope,
  FaBullhorn,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdSubject } from "react-icons/md";
import { SiReactiveresume } from "react-icons/si";
import { BsCalendar2EventFill } from "react-icons/bs";
import { currentUser } from "@clerk/nextjs/server";

// Structured array with titles and items
const menuData = [
  {
    title: "MENU",
    items: [
      {
        name: "Home",
        icon: <FaHome />,
        link: "/admin",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Teachers",
        icon: <FaChalkboardTeacher />,
        link: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        name: "Students",
        icon: <FaUserGraduate />,
        link: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        name: "Parents",
        icon: <FaUser />,
        link: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        name: "Subjects",
        icon: <MdSubject />,
        link: "/list/subjects",
        visible: ["admin"],
      },
      {
        name: "Classes",
        icon: <FaBook />,
        link: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        name: "Lessons",
        icon: <FaClipboardList />,
        link: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        name: "Exams",
        icon: <FaCalendarAlt />,
        link: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Assignments",
        icon: <FaClipboardList />,
        link: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Results",
        icon: <SiReactiveresume />,
        link: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Attendance",
        icon: <FaCalendarAlt />,
        link: "#",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Events",
        icon: <BsCalendar2EventFill />,
        link: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Messages",
        icon: <FaEnvelope />,
        link: "#",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Announcements",
        icon: <FaBullhorn />,
        link: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        name: "Profile",
        icon: <FaUserCircle />,
        link: "#",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Settings",
        icon: <FaCog />,
        link: "#",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        name: "Logout",
        icon: <FaSignOutAlt />,
        link: "#",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  return (
    <div className="flex-1 overflow-y-auto mt-4 text-sm">
      {/* Sidebar scrollable */}
      {menuData.map((section) => (
        <div className="flex flex-col" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light mt-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.link}
                  key={item.name}
                  className="flex items-center justify-center lg:justify-start gap-3 text-gray-500 rounded-lg hover:bg-lamaSkyLight py-2"
                >
                  <span>{item.icon}</span>
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              );
            }
            return null; // Prevent rendering if not visible for the role
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
