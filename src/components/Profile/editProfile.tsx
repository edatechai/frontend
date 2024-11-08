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
import { Eye, EyeOff, Loader, Calendar as CalendarLucide, Copy } from "lucide-react";
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

export function EditProfileForm({ userInfo }: { userInfo: any }) {
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
      dob: new Date(userInfo.dob.year, userInfo.dob.month, userInfo.dob.day) || "",
      license: userInfo?.license || "",
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
                    <Input
                    readOnly 
                     placeholder="John Doe" {...field} />
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
                    readOnly 
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
                <FormControl>
                  <Input
                    readOnly
                    placeholder="Enter gender"
                    {...field}
                  />
                </FormControl>
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
                <FormControl>
                  <Input
                    readOnly
                    placeholder="Enter country"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input
                    readOnly
                    value={field.value ? format(field.value, "PPP") : ""}
                    placeholder="Date of birth"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

<FormField
              control={form.control}
                name="license"
              render={({ field }) => (
                <FormItem className="space-y-0.5 w-full">
                  <FormLabel>License Number</FormLabel>
                  <FormControl className="text-sm">
                    <div className="relative">
                      <Input 
                        value={userInfo?.license || ''} 
                        readOnly 
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => {
                          navigator.clipboard.writeText(userInfo?.license || '')
                            .then(() => toast.success("License number copied to clipboard"))
                            .catch(() => toast.error("Failed to copy license number"));
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
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
