"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useState } from "react";

const loginSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

const FormLogin = () => {
  const [signInError, setSignInError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmission = async (data: LoginSchema) => {
    try {
      const response = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (response?.error) {
        if (response.status === 401) {
          setSignInError("Invalid credentials");
        } else {
          setSignInError("Something went wrong");
        }
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
        <Input
          aria-label={"username"}
          id="username"
          type="text"
          {...register("username")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          aria-label={"password"}
          id="password"
          type="password"
          {...register("password")}
        />
      </div>
      {signInError && <p className={"text-red-500"}>{signInError}</p>}
      <Button type="submit">Login</Button>
    </form>
  );
};

export default FormLogin;
