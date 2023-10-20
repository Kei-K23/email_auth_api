import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";
import { createUserHandler } from "../controller/user.controller";

export default function (router: Router) {
  router.post(
    "/api/user",
    validateResource(createUserSchema),
    createUserHandler
  );
}
