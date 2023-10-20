import { Router } from "express";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/session.schema";
import { createSessionHandler } from "../controller/auth.controller";

export default function (router: Router) {
  router.post(
    "/api/session",
    validateResource(createSessionSchema),
    createSessionHandler
  );
}
