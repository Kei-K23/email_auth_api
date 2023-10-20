import { Request, Response } from "express";
import {
  CreateUserInput,
  createVerificationInput,
} from "../schema/user.schema";
import { createUser, findUserById } from "../service/user.service";
import { MongooseError } from "mongoose";
import sendEmail from "../utils/mailer";
import { ZodError } from "zod";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    const body = req.body;
    const new_user = await createUser(body);

    await sendEmail({
      from: "arkar1712luffy@gmail.com",
      to: new_user?.email,
      subject: "Password verification code",
      text: `verification code: ${new_user?.verification_code}. 
                  User ID : ${new_user?._id}`,
    });

    return res
      .status(200)
      .json({ message: "user was successfully created", data: new_user })
      .end();
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}

export async function createVerificationHandler(
  req: Request<createVerificationInput>,
  res: Response
) {
  try {
    const id = req.params.id;
    const verification_code = req.params.verification_code;

    // find user by id
    const user = await findUserById(id);

    // check credentials to verify user
    if (!user)
      return res.status(400).json({ message: "could not verify the user!" });

    if (user.verify)
      return res.status(400).json({ message: "user is already verify!" });

    if (user.id !== id)
      return res.status(400).json({ message: "could not verify the user!" });

    if (verification_code !== user.verification_code)
      return res.status(400).json({
        message: "verification code doest not match! re-verify again",
      });

    // user verify

    user.verify = true;
    await user.save();

    return res.json(200).json({
      message: `user with id ${user._id} is successfully verified`,
      data: user,
    });
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}
