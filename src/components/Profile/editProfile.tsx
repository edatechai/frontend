import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditPasswordSchema, EditProfileSchema } from "@/lib/schema";
import { Eye, EyeOff, Loader, Calendar as CalendarLucide } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { useUpdateProfileMutation } from "@/features/api/apiSlice";
import { toast } from "sonner";

export function EditProfileForm({ userInfo }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  console.log({ userInfo });
  // 1. Define your form.
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      country: userInfo?.country || "",
      email: userInfo?.email || "",
      fullName: userInfo?.fullName || "",
      gender: userInfo?.gender || "",
      dob:
        new Date(userInfo.dob.year, userInfo.dob.month, userInfo.dob.day) || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof EditProfileSchema>) {
    try {
      const response = await updateProfile({
        id: userInfo._id,
        payload: values,
      });
      if (response.error) {
        toast.error("Profile edit failed", {
          description: response?.error?.data?.message,
        });
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      toast.error("Profile edit failed", {
        description: "Something went wrong",
      });
      console.log("error", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 flex gap-44">
        <div className="w-full space-y-3 mb-10">
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-0.5 w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0.5 w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* <SelectLabel>Roles</SelectLabel> */}
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* <SelectLabel>Roles</SelectLabel> */}
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="England">England</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-0.5">
                <FormLabel>Date of birth</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarLucide className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(e) => {
                        field.onChange(e);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1940-01-01")
                      }
                      defaultMonth={new Date(2024, 6)}
                      captionLayout="dropdown-buttons"
                      fromYear={1980}
                      toYear={2025}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isLoading} className="w-fit self-end" size="sm">
          {isLoading && (
            <span className="mr-2 animate-spin">
              <Loader />
            </span>
          )}
          Edit profile
        </Button>
      </form>
    </Form>
  );
}

export function EditPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = false;
  // 1. Define your form.
  const form = useForm<z.infer<typeof EditPasswordSchema>>({
    resolver: zodResolver(EditPasswordSchema),
    defaultValues: {
      //   username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof EditPasswordSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 flex gap-44">
        <div className="w-full space-y-3 mb-10">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="space-y-0.5 relative">
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                </FormControl>
                <button
                  className={`absolute right-2 bottom-2.5 ${
                    isLoading && "text-border"
                  }`}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="h-4 w-4 opacity-50" />
                  ) : (
                    <Eye size={16} className="h-4 w-4 opacity-50" />
                  )}
                </button>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-0.5 relative w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                    />
                  </FormControl>
                  <button
                    className={`absolute right-2 bottom-2.5 ${
                      isLoading && "text-border"
                    }`}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="h-4 w-4 opacity-50" />
                    ) : (
                      <Eye size={16} className="h-4 w-4 opacity-50" />
                    )}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-0.5 relative w-full">
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                    />
                  </FormControl>
                  <button
                    className={`absolute right-2 bottom-2.5 ${
                      isLoading && "text-border"
                    }`}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="h-4 w-4 opacity-50" />
                    ) : (
                      <Eye size={16} className="h-4 w-4 opacity-50" />
                    )}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button disabled className="w-fit self-end" size="sm">
          {isLoading && (
            <span className="mr-2 animate-spin">
              <Loader />
            </span>
          )}
          Register
        </Button>
      </form>
    </Form>
  );
}
