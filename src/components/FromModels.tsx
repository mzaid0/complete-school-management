"use client";
import {
  deleteClass,
  deleteExam,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  parent: deleteSubject,
  lesson: deleteSubject,
  exam: deleteExam,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
};

// Dynamically importing forms with a loading fallback
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});

const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Mapping different forms to their corresponding components
const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    reqType: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  teacher: (setOpen, reqType, data, relatedData) => (
    <TeacherForm
      reqType={reqType}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, reqType, data, relatedData) => (
    <StudentForm
      reqType={reqType}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  subject: (setOpen, reqType, data, relatedData) => (
    <SubjectForm
      reqType={reqType}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),

  class: (setOpen, reqType, data, relatedData) => (
    <ClassForm
      reqType={reqType}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),

  exam: (setOpen, reqType, data, relatedData) => (
    <ExamForm
      reqType={reqType}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FromModels = ({
  table,
  reqType,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = reqType === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    reqType === "create"
      ? "bg-primaryLight"
      : reqType === "update"
      ? "bg-lamaSky"
      : "bg-secondaryLight";

  const [open, setOpen] = useState<boolean>(false);

  const [state, formAction] = useFormState(deleteActionMap[table], {
    success: false,
    error: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`${table} has been deleted!`);
      router.refresh();
      setOpen(false);
    }
  }, [state]);

  const Form = () => {
    return reqType === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : reqType === "create" || reqType === "update" ? (
      forms[table](setOpen, reqType, data, relatedData)
    ) : (
      "Form not found"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={`/${reqType}.png`} // Corrected path
          alt="Icon"
          width={16}
          height={16}
        />
      </button>
      {open && (
        <div className="h-screen w-screen absolute top-0 left-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-4 relative w-[90%] md:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-2 right-2 cursor-pointer hover:text-red-500 duration-200"
              onClick={() => setOpen(false)}
            >
              <ImCross />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FromModels;
