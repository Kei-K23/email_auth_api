import { Router } from "express";
import userRouter from "./user.router";

const router = Router();

export default function () {
  userRouter(router);
  return router;
}
