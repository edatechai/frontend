import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterSchema } from "../../lib/schema";
import { useCreateUserMutation } from "../../features/api/apiSlice";

export function RegisterForm() {
  const [CreateUser] = useCreateUserMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof RegisterSchema>>({
    mode: "onBlur",
    resolver: zodResolver(RegisterSchema),
  });

  async function onSubmit(body: z.infer<typeof RegisterSchema>) {
    try {
      const response = await CreateUser(body);
      if (response.error) {
      } else {
        alert(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4">
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="first_name">Full Name</Label>
          <Input
            id="first_name"
            placeholder="John Doe"
            autoCapitalize="none"
            autoComplete="fullName"
            autoCorrect="off"
            disabled={isLoading}
            {...register("fullName")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.fullName?.message}</i>
          </span>
        </div>
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="johndoe"
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect="off"
            disabled={isLoading}
            {...register("username")}
          />
          <i className="text-red-400 text-xs">{errors?.username?.message}</i>
        </div>

        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...register("email")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.email?.message}</i>
          </span>
        </div>
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="dateOfBirth">Role</Label>
          {/* <Input
            id="dateOfBirth"
            type="date"
            disabled={isLoading}
            {...register("dob")}
          /> */}
          <span className="text-red-400 text-xs">
            <i>{errors?.role?.message}</i>
          </span>
        </div>
        {/* {parent && disabilities} */}
        {/* <select
            aria-required="true"
            {...register("license")}
            aria-invalid={!!errors?.license}
            aria-errormessage="License key"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={""}
          >
            <option value="" disabled>
              --Select License key--
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select> */}
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="license">License key</Label>
          <Input
            id="license"
            placeholder="1234567890"
            autoCapitalize="none"
            autoComplete="license"
            autoCorrect="off"
            disabled={isLoading}
            {...register("license")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.license?.message}</i>
          </span>
        </div>
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            {...register("password")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.password?.message}</i>
          </span>
        </div>
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.confirmPassword?.message}</i>
          </span>
        </div>
        <Button disabled={isLoading}>
          {isLoading && (
            <span className="mr-2 animate-spin">
              <Loader />
            </span>
          )}
          Register
        </Button>
      </div>
    </form>
  );
}
