import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";
import { CreateSessionInput } from "../schema/session.schema";
import { findUser, findUserById } from "../service/user.service";
import { UserModel } from "../model/user.model";
import {
  findSessionByID,
  refreshToken,
  signAccessToken,
} from "../service/auth.service";
import { verifyJWT } from "../utils/jwt";

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

    const is_auth_user = await UserModel.verifyPassword(
      user.password,
      password
    );

    if (!is_auth_user)
      return res
        .status(400)
        .json({
          message:
            "user is not unauthorized! please provide valid password and email",
        })
        .end();

    const access_toke = signAccessToken(user);

    const refresh_toke = await refreshToken(user._id);

    return res.status(200).json({
      message: "user session is successfully created",
      data: {
        access_toke,
        refresh_toke,
      },
    });
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const refresh_toke = req.header("x-refresh");
    if (!refresh_toke)
      return res.status(401).json({
        message:
          "could not re-fresh user session! missing refresh token header",
      });

    const decoded = verifyJWT<{ session: string }>(
      refresh_toke,
      "REFRESH_TOKEN_PUBLIC_KEY"
    );
    if (!decoded)
      return res.status(401).json({ message: "invalid re-fresh token" });

    const session = await findSessionByID(decoded.session);

    if (!session || !session.valid)
      return res
        .status(401)
        .json({ message: "could not re-fresh user session" });

    const user = await findUserById(String(session.user_id));

    if (!user)
      return res.status(401).json({
        message: "could not re-fresh user session! user is not exist",
      });

    const access_token = signAccessToken(user);

    return res
      .status(200)
      .json({ message: "successfully refresh the user session", access_token });
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}
