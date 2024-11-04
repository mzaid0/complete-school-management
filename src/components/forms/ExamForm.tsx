"use client";
import { createExam, updateExam } from "@/lib/actions";
import { examSchema, ExamSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../InputField";

const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useFormState(
    reqType === "create" ? createExam : updateExam,
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
        `Exam has been ${reqType === "create" ? "Created " : "Updated"}`
      );
      router.refresh();
      setOpen(false);
    }
  }, [state]);

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {reqType === "create" ? "Create a new Exam" : "Update the Exam"}
      </h1>

      <div className="flex justify-between flex-wrap gap-2">
        <InputField
          label="Exam Title"
          name="title"
          register={register}
          defaultValue={data?.title}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startTime"
          register={register}
          defaultValue={data?.startTime}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endTime"
          register={register}
          defaultValue={data?.endTime}
          error={errors?.endTime}
          type="datetime-local"
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
        <label className="text-xs text-gray-500">Lesson</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-1 rounded-md text-sm"
          {...register("lessonId")}
          defaultValue={data?.lessons}
        >
          {lessons.map((lesson: { id: number; name: string }) => (
            <option value={lesson.id} key={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </select>
        {errors?.lessonId?.message && (
          <p className="text-xs text-red-400">
            {errors.lessonId?.message.toString()}
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

export default ExamForm;
