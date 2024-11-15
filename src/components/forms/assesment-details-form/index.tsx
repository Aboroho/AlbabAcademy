// "use client";
// import { FormDetailsProps } from "@/types/common";
// import { assessmentDetailsFormSchema, IAssessmentDetailsForm } from "./schema";
// import {
//   Controller,
//   FieldError,
//   FormProvider,
//   useFieldArray,
//   useForm,
// } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { resolveFormError, FormSection } from "../form-utils";
// import InputField from "@/components/ui/input-field";
// import { SelectGradeField } from "../common-fields";
// import { Button } from "@/components/button";
// import { useEffect } from "react";
// import { PlusIcon } from "lucide-react";
// import { Cross1Icon } from "@radix-ui/react-icons";
// import { useGetTeachers } from "@/client-actions/queries/teacher-queries";
// import { SelectInput } from "@/components/ui/single-select-input";
// import DateInput from "@/components/ui/date-input";
// import { useMutation } from "@tanstack/react-query";
// import { api } from "@/client-actions/helper";
// import { IAssessmentResponse } from "@/types/response_types";
// import toast from "react-hot-toast";

// export function AssementDetailsForm({
//   handleSubmit,
//   renderButton,
//   defaultValues,
// }: FormDetailsProps<IAssessmentResponse, IAssessmentDetailsForm>) {
//   const form = useForm<IAssessmentDetailsForm>({
//     mode: "onBlur",
//     resolver: zodResolver(assessmentDetailsFormSchema),
//     defaultValues: defaultValues,
//   });
//   const {
//     fields: subjectList,
//     prepend,
//     remove,
//   } = useFieldArray({
//     control: form.control,
//     name: "assessment_subjects",
//   });
//   const errors = form.formState.errors;
//   console.log(errors);

//   const subjects = form.watch("assessment_subjects");

//   useEffect(() => {
//     prepend({ subject_name: "", total_mark: 100, teacher_id: undefined });
//   }, [prepend]);

//   const { data: teachers } = useGetTeachers();

//   // mutations
//   const createMutation = useMutation({
//     mutationFn: async (data: IAssessmentDetailsForm) => {
//       const res = await api("/assessments", {
//         method: "post",
//         body: JSON.stringify(data),
//       });
//       return res;
//     },
//   });

//   async function onSubmit(data: IAssessmentDetailsForm) {
//     toast.loading("Creating assessment....", { id: "c-assessment" });
//     const res = await createMutation.mutateAsync(data);
//     toast.dismiss("c-assessment");
//     if (!res.success) return resolveFormError(res, form);
//     toast.success("Assessment Created successfully");
//   }

//   return (
//     <div>
//       <FormProvider {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="mb-4">
//             {renderButton ? (
//               renderButton(form.formState.isSubmitting)
//             ) : (
//               <Button type="submit">Submit Assessment</Button>
//             )}
//           </div>
//           <div className="grid lg:grid-cols-2 gap-6">
//             <FormSection title="Assessment Info ">
//               <InputField
//                 {...form.register("title")}
//                 label="Assessment title"
//                 error={errors.title}
//               />
//               <SelectGradeField />
//               <InputField
//                 label="Assessment Type"
//                 {...form.register("assessment_type")}
//               />

//               <Controller
//                 control={form.control}
//                 name="date"
//                 render={({ field }) => (
//                   <DateInput
//                     error={form.formState.errors.date as FieldError}
//                     onDateChange={field.onChange}
//                     dateValue={field.value}
//                     label="Assessment Date"
//                   />
//                 )}
//               />
//             </FormSection>

//             <FormSection title="Add Subjects for the Assessment">
//               <div className="subjects">
//                 <Button
//                   size="sm"
//                   onClick={() => prepend({ subject_name: "", total_mark: 100 })}
//                   className="mb-4 bg-green-600"
//                   type="button"
//                 >
//                   Add New Subject <PlusIcon className="w-4 h-4" />
//                 </Button>
//                 {errors.assessment_subjects?.message && (
//                   <div className="p-4 rounded-md bg-red-100 text-red-500">
//                     {errors.assessment_subjects.message}
//                   </div>
//                 )}
//                 <div
//                   className="space-y-5"
//                   aria-details="Subject for the assessment"
//                 >
//                   {subjectList.map((subject, index) => (
//                     <div
//                       key={subject.id}
//                       className="flex items-start w-full gap-3"
//                     >
//                       <InputField
//                         label="Subject Name"
//                         {...form.register(
//                           `assessment_subjects.${index}.subject_name`
//                         )}
//                         error={
//                           errors.assessment_subjects?.[index]?.subject_name
//                         }
//                       />

//                       <Controller
//                         control={form.control}
//                         name={`assessment_subjects.${index}.teacher_id`}
//                         render={({ field }) => (
//                           <SelectInput
//                             selectedValue={subjects[index].teacher_id}
//                             options={teachers?.map((teacher) => ({
//                               label: teacher.full_name,
//                               value: teacher.id.toString(),
//                             }))}
//                             label="Assign Teacher (Optional)"
//                             onSelect={(teacherId) => {
//                               field.onChange(teacherId);
//                             }}
//                             emptyText="No teacher's found"
//                             placeholder="Select Teacher "
//                             rightIcon={
//                               subjects.length > 1 ? (
//                                 <Cross1Icon
//                                   className="w-4 h-4 cursor-pointer text-red-500"
//                                   onClick={() => remove(index)}
//                                 />
//                               ) : (
//                                 <></>
//                               )
//                             }
//                           />
//                         )}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </FormSection>
//           </div>
//         </form>
//       </FormProvider>
//     </div>
//   );
// }
