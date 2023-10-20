import { Router } from "express";
import userRouter from "./user.router";
import authRouter from "./auth.router";

const router = Router();

export default function () {
  userRouter(router);
  authRouter(router);
  return router;
}
