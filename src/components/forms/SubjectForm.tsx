"use client";
import { createSubject, updateSubject } from "@/lib/actions";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const [state, formAction] = useFormState(
    reqType === "create" ? createSubject : updateSubject,
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

  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {reqType === "create" ? "Create a new Subject" : "Update the Subject"}
      </h1>

      <div className="flex justify-between flex-wrap gap-2">
        <InputField
          label="Subject name"
          name="name"
          register={register}
          defaultValue={data?.name}
          error={errors?.name}
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
        <label className="text-xs text-gray-500">Teachers</label>
        <select
          multiple
          className="ring-[1.5px] ring-gray-300 p-1 rounded-md text-sm"
          {...register("teachers")}
          defaultValue={data?.teachers}
        >
          {teachers.map(
            (teacher: { id: string; name: string; surname: string }) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name + " " + teacher.surname}
              </option>
            )
          )}
        </select>
        {errors?.teachers?.message && (
          <p className="text-xs text-red-400">
            {errors.teachers?.message.toString()}
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

export default SubjectForm;
