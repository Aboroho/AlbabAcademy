import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ImageUpload } from "../ui/image-upload";
import { Button } from "../button";
import Image from "next/image";

import { UploadImage } from "@/client-actions/helper";

import InputField from "../ui/input-field";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import {
  IAddressCreateFormData,
  IUserCreateFormData,
  PaymentStatus,
} from "./common-schema";
import { FormSection, isEmpty, isNotEmpty, valueAsIntF } from "./form-utils";

import {
  useGetStudents,
  useGetGradeList,
  useGetSectionList,
  useGetCohortList,
} from "@/client-actions/queries/student-queries";
import { SelectInput } from "../ui/single-select-input";
import { Loader2 } from "lucide-react";

import { PaymentTargetTypes } from "./payment-request-form/schema";

import { MultiSelectInput } from "../ui/multiselect-input";
import { useGetTeachers } from "@/client-actions/queries/teacher-queries";
import { Badge } from "../shadcn/ui/badge";
import { useGetPaymentTemplates } from "@/client-actions/queries/payment-queries";
import { IPaymentTemplateResponse } from "@/types/response_types";
import { pdf } from "@react-pdf/renderer";
import StudentInvoice from "../invoice/student-invoice";
import { saveAs } from "file-saver";

/**
 * Default Field Value for user
 */
export const defaultUserField = {
  password: "",
  phone: "",
  username: "",
  avatar: "",
  email: null,
};

/**
 * Default Field Value for user
 */
export const defaultAddressField = {
  district: null,
  sub_district: null,
  union: null,
  village: null,
};

/**
 * Shared Avatar Fields
 */
type Props = {
  defaultAvatarUrl?: string;
  onImageChange: (imageUrl: string) => void;
};
export const AvatarField = ({ defaultAvatarUrl, onImageChange }: Props) => {
  // const [image, setImage] = useState<File | null>();
  const [imageUploading, setImageUploading] = useState(false);

  async function uploadToSever(image: File | null | undefined) {
    if (!image) return;
    setImageUploading(true);

    try {
      const res = await UploadImage(image);

      if (res?.success && res.data) {
        onImageChange(res.data as string);
      } else {
        onImageChange("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setImageUploading(false);
    }
  }

  const renderImage = (src: string, trigger: () => void) => {
    return (
      <div className="w-[128px]">
        <div className="w-[128px] h-[128px] rounded-full bg-gray-400 overflow-hidden transition-all">
          <div className="w-full h-full relative group">
            {src && src.length > 0 && (
              <Image src={src} height={128} width={128} alt="Student Avatar" />
            )}

            {!imageUploading && (
              <Button
                type="button"
                onClick={trigger}
                size="sm"
                className="opacity-0 text-xs absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 group-hover:transition-opacity"
              >
                Choose image
              </Button>
            )}

            {imageUploading && (
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-black opacity-35 flex justify-center items-center">
                <Loader2 className="animate-spin w-10 h-10 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ImageUpload
      multiple={false}
      defaultImageUrl={defaultAvatarUrl}
      onImageChange={(images) => {
        if (images.length > 0) {
          uploadToSever(images[0]);
        }
      }}
      render={(trigger, images, imageUrls, eraseFile) => (
        <div className="w-[128px]">
          {renderImage(
            imageUrls.length > 0
              ? imageUrls[0]
              : defaultAvatarUrl
              ? defaultAvatarUrl
              : "",
            trigger
          )}
          {imageUrls.length > 0 && !imageUploading && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                className="mt-4 select-none"
                onClick={() => {
                  eraseFile(0);
                  onImageChange("");
                }}
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      )}
    />
  );
};

/**
 *
 * Shared Address Fields
 *
 */
export const AddressFields = ({ title }: { title?: string }) => {
  const form = useFormContext<{
    [key: string]: unknown;
    address: IAddressCreateFormData;
  }>();

  const errors = form.formState.errors;
  return (
    <FormSection title={title || "Address"}>
      <InputField
        error={errors.address?.district}
        label="District"
        {...form.register("address.district")}
      />
      <InputField
        error={errors.address?.sub_district}
        label="Sub District"
        {...form.register("address.sub_district")}
      />
      <InputField
        error={errors.address?.union}
        label="Union"
        {...form.register("address.union")}
      />
      <InputField
        error={errors.address?.village}
        label="Village"
        {...form.register("address.village")}
      />
    </FormSection>
  );
};

/**
 * Shared User Fields
 */
type UserFieldsProps = {
  update?: boolean;
  hiddenFields?: string[];
};
export const UserFields = ({
  update = false,
  hiddenFields = [],
}: UserFieldsProps) => {
  const form = useFormContext<{
    [key: string]: unknown;
    user: IUserCreateFormData;
  }>();

  const errors = form.formState.errors;

  return (
    <FormSection>
      <h3 className="text-lg mb-4">Online Profile</h3>
      {!hiddenFields.includes("user.avatar") && (
        <Controller
          control={form.control}
          name="user.avatar"
          render={({ field }) => (
            <AvatarField
              onImageChange={(image) => {
                field.onChange(image);
              }}
              defaultAvatarUrl={form.getValues("user.avatar") as string}
            />
          )}
        />
      )}
      {!hiddenFields.includes("user.username") && (
        <InputField
          label="Username"
          {...form.register("user.username")}
          error={errors.user?.username}
        />
      )}
      {!update && (
        <InputField
          error={errors.user?.password}
          label="Password"
          type="password"
          {...form.register("user.password")}
        />
      )}
      {!hiddenFields.includes("user.email") && (
        <InputField
          error={errors.user?.email}
          label="Email (optional)"
          type="email"
          {...form.register("user.email")}
        />
      )}
    </FormSection>
  );
};

/**
 *
 * Shared Select Grade
 */
export const SelectGradeField = ({
  hideLabel,
  disabled,
}: {
  hideLabel?: boolean;
  disabled?: boolean;
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const grade_id = watch("grade_id") as number;

  const { data: gradeList, isLoading } = useGetGradeList();
  return (
    <Controller
      control={control}
      name="grade_id"
      rules={{}}
      render={({ field }) => (
        <SelectInput
          selectedValue={grade_id?.toString()}
          isLoading={isLoading}
          error={errors.grade_id as FieldError}
          label={!hideLabel ? "Grade" : ""}
          placeholder="Select Grade"
          onSelect={valueAsIntF(field.onChange)}
          triggerClassName="w-full"
          options={gradeList?.map((grade) => ({
            label: grade.name,
            value: grade.id.toString(),
          }))}
          disabled={disabled}
        />
      )}
    />
  );
};

/**
 *
 * Shared Select Section
 */
export const SelectSectionField = ({
  defaultGradeId,
}: {
  defaultGradeId?: number;
}) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const sectionId = watch("section_id");
  const gradeId = defaultGradeId ? defaultGradeId : watch("grade_id");
  const prevGradeId = useRef(gradeId);

  const { data: sectionList, isLoading } = useGetSectionList(
    { enabled: isNotEmpty(gradeId) },
    {
      gradeId: parseInt(gradeId),
    }
  );

  useEffect(() => {
    if (isNotEmpty(prevGradeId.current) && prevGradeId.current !== gradeId)
      setValue("section_id", "");
  }, [gradeId, setValue]);

  return (
    <Controller
      control={control}
      name="section_id"
      render={({ field }) => (
        <SelectInput
          selectedValue={sectionId?.toString()}
          isLoading={isLoading}
          disabled={isEmpty(gradeId)}
          error={errors.section_id as FieldError}
          label="Section"
          placeholder="Select Section"
          onSelect={valueAsIntF(field.onChange)}
          triggerClassName="w-full"
          options={sectionList?.map((section) => ({
            label: section.name,
            value: section.id.toString(),
          }))}
        />
      )}
    />
  );
};

/**
 * Shared Select Cohort
 */
type CohortProps = {
  defaultSectionId?: number;
};
export const SelectCohortField = ({ defaultSectionId }: CohortProps) => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const cohortId = watch("cohort_id");
  const sectionId = defaultSectionId ? defaultSectionId : watch("section_id");
  const prevSectionId = useRef(sectionId);

  useEffect(() => {
    if (
      isNotEmpty(prevSectionId.current) &&
      prevSectionId.current !== sectionId
    )
      setValue("cohort_id", "");
  }, [sectionId, setValue]);

  const { data: cohortList, isLoading: cohortListLoading } = useGetCohortList(
    { enabled: isNotEmpty(sectionId) },
    {
      sectionId,
    }
  );

  return (
    <Controller
      control={control}
      name="cohort_id"
      render={({ field }) => (
        <SelectInput
          selectedValue={cohortId?.toString()}
          isLoading={cohortListLoading}
          ref={field.ref}
          disabled={isEmpty(sectionId)}
          error={errors.cohort_id as FieldError}
          label="Cohort/Group"
          placeholder="Select Cohort"
          onSelect={valueAsIntF(field.onChange)}
          triggerClassName="w-full"
          options={cohortList?.map((cohort) => ({
            label: cohort.name,
            value: cohort.id.toString(),
          }))}
        />
      )}
    />
  );
};

/**
 * Shared Select Gender
 */
export const SelectGenderField = () => {
  const form = useFormContext();

  const gender = form.watch("gender");
  const options = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
  ];

  return (
    <Controller
      control={form.control}
      name="gender"
      render={({ field }) => (
        <SelectInput
          selectedValue={gender}
          ref={field.ref}
          error={form.formState.errors.gender as FieldError}
          label="Gender"
          placeholder="Select Gender"
          onSelect={field.onChange}
          options={options}
        />
      )}
    />
  );
};

/**
 * Shared select month
 */
type SelectMonthProps = Omit<
  React.ComponentProps<typeof SelectInput>,
  "options"
>;
export const SelectMonth = (props: SelectMonthProps) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <SelectInput
      options={months.map((month) => ({ label: month, value: month }))}
      {...props}
    />
  );
};

/**
 * Shared Select Year
 */
type SelectYearProps = Omit<
  React.ComponentProps<typeof SelectInput>,
  "options"
>;
export const SelectYear = (props: SelectYearProps) => {
  const nextYear = new Date(Date.now()).getFullYear() + 1;
  const years = Array.from({ length: 10 }, (_, i) => nextYear - i);

  return (
    <SelectInput
      {...props}
      options={years.map((year) => ({
        label: year.toString(),
        value: year.toString(),
      }))}
    />
  );
};

/**
 * Shared Select Payment Target
 */
type SelectPaymentTargetTypesProps = Omit<
  React.ComponentProps<typeof SelectInput>,
  "options"
>;
export const SelectPaymentTargetTypes = (
  props: SelectPaymentTargetTypesProps
) => {
  const types = PaymentTargetTypes.options;

  return (
    <SelectInput
      {...props}
      options={types.map((type) => ({
        label: type.toString(),
        value: type.toString(),
      }))}
    />
  );
};

/**
 *
 * Shared Select Payment Target
 */
export const SelectPaymentTarget = ({
  targetType,
}: {
  targetType: (typeof PaymentTargetTypes.options)[number] | undefined | null;
}) => {
  const { data: studentData, isLoading: studentLoading } = useGetStudents({
    enabled: targetType === "STUDENT",
  });
  const students = studentData?.students;
  const { data: teachers, isLoading: teacherLoading } = useGetTeachers({
    enabled: targetType === "TEACHER",
  });

  const { data: grades, isLoading: gradeLoading } = useGetGradeList({
    enabled: targetType === "GRADE",
  });

  const { data: sections, isLoading: sectionLoading } = useGetSectionList({
    enabled: targetType === "SECTION",
  });

  const { data: cohorts, isLoading: cohortLoading } = useGetCohortList({
    enabled: targetType === "COHORT",
  });

  const isLoading =
    studentLoading ||
    teacherLoading ||
    gradeLoading ||
    sectionLoading ||
    cohortLoading;
  const form = useFormContext<{ payment_targets: number[] }>();

  const placeholder = `Select ${targetType?.toLowerCase() || "target"}s`;

  const setValue = form.setValue;
  useEffect(() => {
    setValue("payment_targets", []);
  }, [targetType, setValue]);

  const options = {
    default: [{ label: "", value: "" }],
    STUDENT: students?.map((st) => ({
      label: (
        <div className="flex gap-3">
          {st.full_name}
          <Badge className="bg-green-400">{st.grade.name} </Badge>
          <Badge className="bg-slate-400">{st.section.name}</Badge>

          <Badge>Roll - {st.roll}</Badge>
        </div>
      ),
      value: st.user.id.toString(),
    })),
    TEACHER: teachers?.map((te) => ({
      label: te.full_name,
      value: te.user.id.toString(),
    })),
    GRADE: grades?.map((g) => ({ label: g.name, value: g.id.toString() })),
    SECTION: sections?.map((s) => ({
      label: (
        <div className="flex gap-3">
          {s.name}
          <Badge className="bg-green-600">{s.grade.name} </Badge>
        </div>
      ),
      value: s.id.toString(),
    })),
    COHORT: cohorts?.map((c) => ({
      label: (
        <div className="flex gap-3">
          {c.name}
          <Badge className="bg-green-600">{c.section.grade.name} </Badge>
          <Badge className="bg-slate-600">{c.section.name} </Badge>
        </div>
      ),
      value: c.id.toString(),
    })),
  }[targetType || "default"] || [{ label: "", value: "" }];

  return (
    <Controller
      control={form.control}
      name="payment_targets"
      render={({ field }) => (
        <MultiSelectInput
          ref={field.ref}
          onBlur={field.onBlur}
          label="Payment Target"
          placeholder={placeholder}
          onValueChange={(value) =>
            field.onChange(value.map((v) => parseInt(v)))
          }
          defaultValue={form.watch("payment_targets")?.map((v) => v.toString())}
          options={options}
          error={form.formState.errors.payment_targets as FieldError}
          disabled={!targetType || isLoading}
          isLoading={isLoading}
        />
      )}
    />
  );
};

/**
 * Shared enroll time payment
 */

type StudentPaymentInvoiceDetails = {
  mobile: string;
  name: string;
  grade: string;
  section: string;
  cohort: string;
  studentId: string;
  paymentId: string;
};
export type PaymentOnEnrollRefType = {
  downloadInvoice: (student: StudentPaymentInvoiceDetails) => Promise<void>;
};
export const PaymentOnEnroll = forwardRef<PaymentOnEnrollRefType>(({}, ref) => {
  const form = useFormContext();

  const paymentTemplateId = form.watch("payment_template_id");
  const paymentStatus = form.watch("payment_status");
  const errors = form.formState.errors;

  const { data: paymentTemplates } = useGetPaymentTemplates();
  const [selectedTemplate, setSelectedTemplate] =
    useState<IPaymentTemplateResponse>();

  useEffect(() => {
    const _selectedTemplate = paymentTemplates?.find(
      (tem) => tem.id === paymentTemplateId
    );
    setSelectedTemplate(_selectedTemplate);
  }, [paymentTemplateId, paymentTemplates]);

  async function handleDownloadInvoice(details: StudentPaymentInvoiceDetails) {
    if (!selectedTemplate) return;
    const fileName =
      "invoice-student-" + details.name + "-" + details.studentId;
    const data = {
      fees: selectedTemplate.template_fields.map((f) => ({
        details: f.description,
        amount: f.amount,
      })),
      mobile: details.mobile,
      name: details.name,
      studentGrade: details.grade,
      studentSection: details.section,
      studentCohort: details.cohort,
      studentID: details.studentId,
      paymentId: details.paymentId,
    };
    try {
      const blob = await pdf(
        <StudentInvoice {...data} paymentDetails={[]} />
      ).toBlob();

      saveAs(blob, fileName);
    } catch (err) {
      console.log(err);
    }
  }

  useImperativeHandle(ref, () => ({
    async downloadInvoice(details) {
      await handleDownloadInvoice(details);
    },
  }));

  const totalAmount =
    selectedTemplate?.template_fields.reduce(
      (acc, cur) => acc + cur.amount,
      0
    ) || 0;

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="payment_template_id"
        render={({ field }) => (
          <SelectInput
            label="Payment Template"
            placeholder="choose a template"
            selectedValue={paymentTemplateId?.toString()}
            options={paymentTemplates?.map((template) => ({
              label: template.name,
              value: template.id.toString(),
            }))}
            onSelect={(selectedTemplateId) => {
              if (selectedTemplateId)
                field.onChange(parseInt(selectedTemplateId));
              else field.onChange(undefined);
            }}
            error={errors.payment_template_id as FieldError}
          />
        )}
      />
      {selectedTemplate && (
        <>
          <div className="p-4 rounded-md bg-gray-100">
            <h4 className="text-xl mb-4 ">Payment Details</h4>
            <div className="space-y-1">
              {selectedTemplate?.template_fields.map((f) => (
                <div key={f.id} className="flex justify-between ">
                  <div>{f.description}</div>
                  <div>{f.amount} ৳</div>
                </div>
              ))}
            </div>
            <hr className="my-3" />
            <div className="text-right">
              Total Amount -{" "}
              <span className="font-semibold">{totalAmount}</span> ৳
            </div>
          </div>
        </>
      )}

      <Controller
        control={form.control}
        name="payment_status"
        render={({ field }) => (
          <SelectInput
            label="Payment Status"
            placeholder="Select payment status"
            selectedValue={paymentStatus?.toString()}
            options={PaymentStatus.options.map((status) => ({
              label: status,
              value: status,
            }))}
            onSelect={(value) =>
              value ? field.onChange(value) : field.onChange(undefined)
            }
            error={errors.payment_status as FieldError}
            disabled={!paymentTemplateId}
          />
        )}
      />
    </div>
  );
});

PaymentOnEnroll.displayName = "PaymentOnEnroll";
