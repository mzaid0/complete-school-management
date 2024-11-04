"use client";
import { createClass, updateClass } from "@/lib/actions";
import { classSchema, ClassSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";

const ClassForm = ({
  reqType,
  data,
  setOpen,
  relatedData,
}: {
  reqType: "create" | "update";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  const [state, formAction] = useFormState(
    reqType === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    // submit data to the server here
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Subject has been ${reqType === "create" ? "Created " : "Updated"}`
      );
      router.refresh();
      setOpen(false);
    }
  }, [state]);

  const { teachers, grades } = relatedData;

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {reqType === "create" ? "Create a new Class" : "Update the Class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-2">
        <InputField
          label="Class name"
          name="name"
          register={register}
          defaultValue={data?.name}
          error={errors?.name}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-2">
        <InputField
          label="Capacity "
          name="capacity"
          register={register}
          defaultValue={data?.capacity}
          error={errors?.capacity}
        />
      </div>

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
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Supervisor</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-1 rounded-md text-sm"
          {...register("supervisorId")}
          defaultValue={data?.teachers}
        >
          {teachers.map(
            (teacher: { id: string; name: string; surname: string }) => (
              <option
                value={teacher.id}
                key={teacher.id}
                selected={data && teacher.id === data.supervisorId}
              >
                {teacher.name + " " + teacher.surname}
              </option>
            )
          )}
        </select>
        {errors?.supervisorId?.message && (
          <p className="text-xs text-red-400">
            {errors.supervisorId?.message.toString()}
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
            <option
              value={grade.id}
              key={grade.id}
              selected={data && grade.id === data.gradeId}
            >
              {grade.level}
            </option>
          ))}
        </select>
        {errors?.gradeId?.message && (
          <p className="text-xs text-red-400">
            {errors.gradeId?.message.toString()}
          </p>
        )}
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {reqType === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
