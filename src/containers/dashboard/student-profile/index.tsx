// "use client";
// import { useGetStudentById } from "@/client-actions/queries/student-queries";
// import { Button } from "@/components/button";
// import { Badge } from "@/components/shadcn/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/shadcn/ui/card";
// import { Tabs, TabsList } from "@/components/shadcn/ui/tabs";
// import Loader from "@/components/ui/skeleton/loader";
// import { formatDate } from "@/lib/utils";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
// import { CalendarIcon, HomeIcon, PhoneIcon, UserIcon } from "lucide-react";
// import React from "react";

// type Props = {
//   studentId: number;
// };

// const Detail = ({
//   label,
//   value,
// }: {
//   label: string;
//   value: string | number | undefined | null;
// }) => (
//   <div>
//     <p className="text-sm font-medium text-gray-500">{label}</p>
//     <p className="text-lg font-semibold text-gray-800">{value || "N/A"}</p>
//   </div>
// );
// export default function StudentProfile({ studentId }: Props) {
//   const { data: studentProfile, isLoading } = useGetStudentById(studentId);

//   if (isLoading) return <Loader />;
//   if (!studentProfile) return <div>No student found</div>;

//   const {
//     full_name,
//     student_id,
//     roll,
//     father_name,
//     mother_name,
//     guardian_phone,
//     date_of_birth,
//     address,
//     gender,
//     residential_status,
//     student_status,
//     cohort,
//     section,
//     grade,
//   } = studentProfile;
//   return (
//     <div>
//       <div className="bg-gray-50 min-h-screen py-10">
//         <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column: Personal Details */}
//           <Card className="shadow-md border border-gray-200">
//             <CardHeader className="bg-gray-100 p-4 rounded-t-md">
//               <CardTitle className="text-lg font-semibold text-gray-800">
//                 Personal Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-4">
//               <Detail label="Full Name" value={full_name} />
//               <Detail label="Student ID" value={student_id} />
//               <Detail label="Roll" value={roll} />
//               <Detail label="Date of Birth" value={formatDate(date_of_birth)} />
//               <Detail label="Gender" value={gender} />
//               <Detail label="Residential Status" value={residential_status} />
//               <Detail label="Father's Name" value={father_name} />
//               <Detail label="Mother's Name" value={mother_name} />
//               <Detail label="Guardian Phone" value={guardian_phone} />
//               <Detail label="Address" value={address.district} />
//             </CardContent>
//           </Card>

//           {/* Right Column: Academic Details */}
//           <Card className="shadow-md border border-gray-200">
//             <CardHeader className="bg-gray-100 p-4 rounded-t-md">
//               <CardTitle className="text-lg font-semibold text-gray-800">
//                 Academic Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 space-y-4">
//               <Detail label="Grade" value={grade.name} />
//               <Detail label="Cohort" value={cohort.name} />
//               <Detail label="Section" value={section.name} />
//               <Detail label="Student Status" value={student_status} />
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="min-h-[300px] mt-10">
//         <Tabs>
//           <TabsList className="mb-4">
//             <TabsTrigger value="payment">Payment</TabsTrigger>
//           </TabsList>
//           <TabsList className="mb-4">
//             <TabsTrigger value="Assessment">Assessment</TabsTrigger>
//           </TabsList>
//           <div className="p-4 border rounded-md ">
//             <TabsContent value="payment">
//               <div>Payment</div>
//             </TabsContent>
//           </div>
//         </Tabs>
//       </div>
//     </div>
//   );
// }
