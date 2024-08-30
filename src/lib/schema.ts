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
      .max(20, { message: "Can not be more than 20 characters" }),
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
      .max(20, { message: "Can not be more than 20 characters" })
      .regex(new RegExp(/^(?=.*[a-zA-Z0-9])(?=.*[^a-zA-Z0-9]).{8,}$/), {
        message: "Must include alphanumeric and non-alphanumeric characters",
      }),
    email: z
      .string()
      .email({ message: "Please input a valid email address" })
      .max(30, { message: "Must contain at most 30 characters" }),
    role: z
      .string()
      .min(2, { message: "Select the gender" })
      .max(30, { message: "Too long!" }),
    neurodiversity: z.string().optional(),
    license: z
      .string()
      .min(2, { message: "Can not be less than 2 characters" })
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
  user_country: z.string().min(1, { message: "Can not be empty" }),
  // total_marks: z.coerce.number().min(1, { message: "Can not be less than 1" }),
});
