import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Calendar as CalendarLucide, Eye, EyeOff, Loader } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "../../lib/schema";
import { useCreateUserMutation } from "../../features/api/apiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import TermsAndConditions from "./terms-and-conditions";

export function RegisterForm({ toggle }: { toggle: () => void }) {
  const [CreateUser, { isLoading }] = useCreateUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });

  const watchRole = form.watch("role");

  useEffect(() => {
    if (watchRole === "student") {
      form.setValue("ageRange", undefined);
    } else {
      form.setValue("dob", undefined);
    }
  }, [watchRole, form]);

  async function onSubmit(body: z.infer<typeof RegisterSchema>) {
    console.log("body", body);
    try {
      const trimmedData = {
        ...body,
        fullName: body.fullName.trim(),
        email: body.email?.trim(),
        password: body.password.trim(),
        confirmPassword: body.confirmPassword.trim(),
        license: body.license.trim(),
      };

      const response = await CreateUser(trimmedData);
      if (response.error) {
        toast.error("Registration failed", {
          description: response?.error?.data?.message,
        });
      } else {
        if (response.data.statusMsg === "verify your email") {
          alert(response.data.message);
          toggle();
        } else {
          toast(response.data.message);
          toggle();
        }
      }
    } catch (error) {
      toast.error("Registration failed", {
        description: "Something went wrong",
      });
      console.log("error", error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
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
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Are you a teacher, student or parent?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchRole !== "student" && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchRole == "parent" && (
            <FormField
              control={form.control}
              name="neurodiversity"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Neurodiversity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Does your child belong to any of the below" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Autism">Autism</SelectItem>
                      <SelectItem value="ADHD">
                        Attention Deficit Hyperactivity Disorder (ADHD)
                      </SelectItem>
                      <SelectItem value="Dyscalculia">Dyscalculia</SelectItem>
                      <SelectItem value="Dyslexia">Dyslexia</SelectItem>
                      <SelectItem value="Dyspraxia">
                        Dyspraxia, or Developmental Coordination Disorder (DCD)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {watchRole === "student" ? (
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0.5">
                  <FormLabel>Date of Birth</FormLabel>
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
                          {field.value instanceof Date &&
                          !isNaN(field.value.getTime()) ? (
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
                        onSelect={(date) => {
                          if (date instanceof Date && !isNaN(date.getTime())) {
                            field.onChange(date);
                            setIsCalendarOpen(false);
                          } else {
                            // Handle invalid date selection if necessary
                            toast.error("Invalid date selected");
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1940-01-01")
                        }
                        defaultMonth={new Date()}
                        captionLayout="dropdown-buttons"
                        fromYear={1980}
                        toYear={2025}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>Age Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your age range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="25-35">25 to 35</SelectItem>
                      <SelectItem value="35-45">35 to 45</SelectItem>
                      <SelectItem value="45-55">45 to 55</SelectItem>
                      <SelectItem value="55-60">55 to 60</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem className="space-y-0.5">
                <FormLabel>License key</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-0.5 relative">
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
              <FormItem className="space-y-0.5 relative">
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

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-center justify-start space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    {...field}
                    id="terms"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </FormControl>
                <FormLabel htmlFor="terms" className="text-sm">
                  I agree to the{""}
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Terms and Conditions
                  </button>
                </FormLabel>
              </FormItem>
            )}
          />
          <FormMessage />

          <Button disabled={isLoading} className="w-full">
            {isLoading && (
              <span className="mr-2 animate-spin">
                <Loader />
              </span>
            )}
            Register
          </Button>
        </form>
      </Form>

      {isTermsOpen && (
        <TermsAndConditions onClose={() => setIsTermsOpen(false)} />
      )}
    </>
  );
}
