"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

const FormLogin = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmission = async (data: LoginSchema) => {
    console.log(data);
    try {
      const response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      console.log(response);
      if (response?.error) {
        console.log(response.error);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmission)}
      className={"container mx-auto flex max-w-lg flex-col gap-8 p-8"}
    >
      <h1 className={"text-2xl"}>Login page</h1>

      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input type="text" {...register("username")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input type="password" {...register("password")} />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
};

export default FormLogin;
