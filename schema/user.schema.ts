import { TypeOf, z } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
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
      confirm_password: z
        .string({
          required_error: "confirm password field is required",
        })
        .min(
          6,
          "confirm password should be min length of 6 and same with password"
        ),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "confirm password must be same with password",
      path: ["confirm_password"],
    }),
});

export const createVerificationSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "user id is required",
    }),
    verification_code: z.string({
      required_error: "verification code is required",
    }),
  }),
});

export const createForgetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email field is required",
      })
      .email("invalid email format"),
  }),
});
export const createResetPasswordSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "user id is required",
    }),
    password_reset_code: z.string({
      required_error: "password reset code is required",
    }),
  }),
  body: z
    .object({
      password: z
        .string({
          required_error: "password field is required",
        })
        .min(6, "password should be min length of 6"),
      confirm_password: z
        .string({
          required_error: "confirm password field is required",
        })
        .min(
          6,
          "confirm password should be min length of 6 and same with password"
        ),
    })
    .refine((data) => data.confirm_password === data.password, {
      message: "confirm password must be same with password",
      path: ["confirm_password"],
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type createVerificationInput = TypeOf<
  typeof createVerificationSchema
>["params"];

export type CreateForgetPasswordInput = TypeOf<
  typeof createForgetPasswordSchema
>["body"];

export type CreateResetPasswordInput = TypeOf<typeof createResetPasswordSchema>;
