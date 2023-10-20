import { Router } from "express";
import validateResource from "../middleware/validateResource";
import {
  createForgetPasswordSchema,
  createResetPasswordSchema,
  createUserSchema,
  createVerificationSchema,
} from "../schema/user.schema";
import {
  createUserHandler,
  createVerificationHandler,
  forgetPasswordHandler,
  getAllUsersHandler,
  getSessionUser,
  resetPasswordHandler,
} from "../controller/user.controller";
import { deserializedUser } from "../middleware/deserializeUser";
import { requiredUser } from "../middleware/requiredUser";

export default function (router: Router) {
  router.get("/api/user", getAllUsersHandler);
  router.get("/api/user/me", requiredUser, getSessionUser);
  router.post(
    "/api/user",
    validateResource(createUserSchema),
    createUserHandler
  );
  router.post(
    "/api/user/verify/:id/:verification_code",
    validateResource(createVerificationSchema),
    createVerificationHandler
  );
  router.post(
    "/api/user/reset_pass/:id/:password_reset_code",
    validateResource(createResetPasswordSchema),
    resetPasswordHandler
  );
  router.post(
    "/api/user/reset_password",
    validateResource(createForgetPasswordSchema),
    forgetPasswordHandler
  );
}
