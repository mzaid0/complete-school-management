"use client";
import { createStudent, updateStudent } from "@/lib/actions";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";

const StudentForm = ({
  reqType,
  data,
  setOpen,
  relatedData,
}: {
  reqType: "create" | "update";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any; // related data for dropdowns
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [state, formAction] = useFormState(
    reqType === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const [img, setImg] = useState<any>();

  const onSubmit = handleSubmit((data) => {
    // submit data to the server here
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Student has been ${reqType === "create" ? "Created " : "Updated"}`
      );
      router.refresh();
      setOpen(false);
    }
  }, [state]);

  const { grades, classes } = relatedData;

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {reqType === "create" ? "Create a new Student" : "Update the Student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-2">
        <InputField
          label="Username"
          name="username"
          register={register}
          defaultValue={data?.username}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          defaultValue={data?.email}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          defaultValue={data?.password}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <CldUploadWidget
        uploadPreset="School"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-700 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image src="/upload.jpg" alt="" width={28} height={28} />
              <span>Upload an image</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="flex justify-between flex-wrap gap-2">
        <InputField
          label="First Name"
          name="name"
          register={register}
          defaultValue={data?.name}
          error={errors?.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          defaultValue={data?.surname}
          error={errors?.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          defaultValue={data?.phone}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          defaultValue={data?.address}
          error={errors?.address}
        />
        {data && (
          <div className="flex justify-between flex-wrap gap-2">
            <InputField
              label="Id"
              name="id"
              register={register}
              defaultValue={data?.id}
              error={errors?.id}
              hidden
            />
          </div>
        )}
        <InputField
          label="Blood Type"
          name="bloodType"
          register={register}
          defaultValue={data?.bloodType}
          error={errors?.bloodType}
        />

        <InputField
          label="Parent Id"
          name="parentId"
          register={register}
          defaultValue={data?.parentId}
          error={errors?.parentId}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-1 rounded-md text-sm"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors?.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-1 rounded-md text-sm"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors?.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-1 rounded-md text-sm"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map(
              (classItem: {
                id: number;
                name: string;
                capacity: number;
                _count: { students: number };
              }) => (
                <option value={classItem.id} key={classItem.id}>
                  ({classItem.name} -{" "}
                  {classItem._count.students + "/" + classItem.capacity}{" "}
                  Capacity)
                </option>
              )
            )}
          </select>
          {errors?.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && <p className=" text-red-400">Something went wrong</p>}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {reqType === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
