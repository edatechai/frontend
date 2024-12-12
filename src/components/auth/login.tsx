import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSchema } from "../../lib/schema";
import { useLoginMutation } from "../../features/api/apiSlice";
import { toast } from "sonner";

export const LoginForm = () => {
  const [Login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  //   const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    try {
      const trimmedData = {
        loginIdentifier: data.loginIdentifier.trim(),
        password: data.password.trim()
      };
      const response = await Login(trimmedData);
      if (response.error) {
        toast.error("Login failed", {
          description: response?.error?.data?.message,
        });
        return;
      }
      if (response.data.token) {
        toast("Login successful");
        const Token = response.data.token;
        localStorage.setItem("Token", Token);
        window.location.reload();
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="username">Email/Username</Label>
          <Input
            id="username"
            placeholder="name@example.com"
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect="off"
            disabled={isLoading}
            required
            {...register("loginIdentifier")}
          />
        </div>
        <span className="text-red-400 text-xs">
          <i>{errors?.loginIdentifier?.message}</i>
        </span>
        <div className="grid gap-1.5 w-full items-center relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            {...register("password")}
            className="pr-8"
          />
          <button
            className={`absolute right-2 top-7 ${isLoading && "text-border"}`}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <span className="text-red-400 text-xs">
            <i>{errors?.password?.message}</i>
          </span>
          
        </div>
        <Button disabled={isLoading}>
          {isLoading && (
            <span className="mr-2 animate-spin">
              <Loader />
            </span>
          )}
          Login
        </Button>
      </div>
    </form>
  );
};
