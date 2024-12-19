import { z } from "zod";

export const LoginSchema = z.object({
  loginIdentifier: z
    .string()
    .min(1, "Email or Username is required")
    .regex(
      /^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|([A-Za-z][A-Za-z0-9_-]{3,})$/,
      "Invalid email or username format"
    ),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  role: z.enum(["teacher", "student", "parent"]),
  email: z.string().email().optional(),
  gender: z.enum(["Male", "Female"]),
  country: z.string(),
  neurodiversity: z.string().optional(),
  dob: z.date().optional(),
  ageRange: z.string().optional(),
  license: z.string().min(10, "License key must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => {
  if (data.role === "student") {
    return data.dob !== undefined;
  } else {
    return data.ageRange !== undefined;
  }
}, {
  path: ["dob", "ageRange"],
  message: "Required field based on role",
});

export const EditPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
    password: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const EditProfileSchema = z.object({
  fullName: z
    .string()
    .min(4, { message: "Can not be less than 4 characters" })
    .max(40, { message: "Can not be more than 40 characters" }),
  email: z
    .string()
    .email({ message: "Please input a valid email address" })
    .max(30, { message: "Must contain at most 30 characters" }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string({
    required_error: "Gender is required.",
  }),
  country: z.string({
    required_error: "Country is required.",
  }),
  neurodiversity: z.string().optional(),
});

export const AITaskSchema = z.object({
  // learning_outcomes: z.string().min(1, { message: "Can not be empty" }).array(),
  estimated_time: z.coerce
    .number()
    .min(1, { message: "Can not be less than 1" }),
  total_score: z.coerce.number().min(1, { message: "Can not be less than 1" }),
  total_questions: z.coerce
    .number()
    .min(1, { message: "Can not be less than 1" }),
  exam_board: z.string().min(1, { message: "Can not be empty" }),
  // total_marks: z.coerce.number().min(1, { message: "Can not be less than 1" }),
});

export const CreateClassroomSchema = z.object({
  yearGroup: z.string({
    required_error: "Please select a year group.",
  }),
  aim: z.string({
    required_error: "Please select an arm.",
  }),
  subject: z.string({
    required_error: "Please select a subject.",
  }),
});

export const EditQuizSchema = z.object({
  _id: z.string({
    required_error: "Please select a year group.",
  }),
  question: z.string({
    required_error: "Please select an arm.",
  }),
  optionA: z.string({
    required_error: "Please select a subject.",
  }),
  optionB: z.string({
    required_error: "Please select a subject.",
  }),
  optionC: z.string({
    required_error: "Please select a subject.",
  }),
  optionD: z.string({
    required_error: "Please select a subject.",
  }),
  answer: z.enum(["A", "B", "C", "D"]),
});
