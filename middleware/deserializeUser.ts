import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

export async function deserializedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth_session_token = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );
  if (!auth_session_token) return next();
  const decoded = verifyJWT(auth_session_token, "ACCESS_TOKEN_PUBLIC_KEY");
  if (!decoded) return next();
  res.locals.user = decoded;
  next();
}
