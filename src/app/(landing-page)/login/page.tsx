"use client";
import { Button } from "@/components/button";
import InputField from "@/components/ui/input-field";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  username: z.string().min(1, "username required"),
  password: z.string().min(1, "password required"),
});

function Login() {
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const { username, password } = data;

    setServerError("");
    setSubmitting(true);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setSubmitting(false);
    if (!res?.ok) {
      setServerError("Username of password is incorrect");
    } else if (res?.error) {
      setServerError("Something went wrong!!");
    } else {
      router.push("/management/dashboard");
    }
  }
  return (
    <div className="w-full max-h-screen min-h-[50vh]  flex justify-center items-center ">
      <div className="p-4 w-[360px] md:w-[540px] max-h-fit ">
        {serverError && (
          <div className="serverError bg-red-200 text-red-800 p-4 rounded-md mb-6">
            {serverError}
          </div>
        )}
        <form action="" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Username"
            {...register("username")}
            error={errors.username}
          />
          <InputField
            label="password"
            type="password"
            error={errors.password}
            {...register("password")}
          />
          <Button size="sm" type="submit" disabled={submitting}>
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
