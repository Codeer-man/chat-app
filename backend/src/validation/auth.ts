import z from "zod";

export const signupValidation = z
  .object({
    fullname: z
      .string()
      .min(4, "Full name must be 4 character long")
      .max(25, "Must be less than 25 character"),
    email: z.email("invalid email format"),
    password: z.string().min(8, "Must be 8 character long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password donot match",
    path: ["confirmPassword"],
  });

export const loginValidation = z.object({
  email: z.email("invalid email format"),
  password: z.string().min(8, "Must be 8 character long"),
});
