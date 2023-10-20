import { Request, Response, NextFunction } from "express";

export function requiredUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  if (!user)
    return res
      .status(403)
      .json({ message: "authorization is required for the user" });

  if (user) return next();
}
