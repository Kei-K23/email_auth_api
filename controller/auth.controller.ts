import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";
import { CreateSessionInput } from "../schema/session.schema";
import { findUser } from "../service/user.service";
import { UserModel } from "../model/user.model";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  try {
    const { email, password } = req.body;

    const user = await findUser({ email });
    // check credentials to verify user
    if (!user)
      return res
        .status(400)
        .json({ message: "user is not register yet!" })
        .end();

    if (!user.verify)
      return res.status(400).json({ message: "user is not verify yet!" }).end();

    const is_auth_user = await UserModel.verifyPassword(user.password);
    if (!is_auth_user)
      return res
        .status(400)
        .json({
          message:
            "user is not unauthorized! please provide valid password and email",
        })
        .end();
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}
