import { z } from "zod";

export const LoginSchema = z.object({
  loginIdentifier: z.string(),
  password: z.string(),
});

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(4, { message: "Can not be less than 4 characters" })
      .max(40, { message: "Can not be more than 40 characters" }),
    username: z
      .string()
      .min(4, { message: "Can not be less than 4 characters" })
      .max(20, { message: "Can not be more than 20 characters" })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
    //   .regex(new RegExp(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/), {
    //     message: "Must include alphanumeric and non-alphanumeric characters",
    //   }),
    confirmPassword: z
      .string()
      .min(8, { message: "Can not be less than 8 characters" })
      .max(20, { message: "Can not be more than 20 characters" }),
    // .regex(new RegExp(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/), {
    //   message: "Must include alphanumeric and non-alphanumeric characters",
    // }),
    email: z
      .string()
      .email({ message: "Please input a valid email address" })
      .optional(),

      
      
    role: z
      .string()
      .min(2, { message: "Select the gender" })
      .max(30, { message: "Too long!" }),
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

    license: z
      .string()
      .min(2, { message: "Can not be less than 2 characters" })
      .max(50, { message: "Can not be more than 50 characters" }),
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
