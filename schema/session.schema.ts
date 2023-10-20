import { TypeOf, z } from "zod";

export const createSessionSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email field is required",
      })
      .email("invalid email format"),
    password: z
      .string({
        required_error: "password field is required",
      })
      .min(6, "password should be min length of 6"),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
