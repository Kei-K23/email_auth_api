import { Request, Response } from "express";
import {
  CreateForgetPasswordInput,
  CreateResetPasswordInput,
  CreateUserInput,
  createVerificationInput,
} from "../schema/user.schema";
import {
  createUser,
  findAllUsers,
  findUser,
  findUserById,
  updateUser,
} from "../service/user.service";
import { MongooseError } from "mongoose";
import sendEmail from "../utils/mailer";
import { ZodError } from "zod";
import argon2 from "argon2";

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
      .json({
        message:
          "user was successfully created! Please verify first before use",
        data: new_user,
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
      return res
        .status(400)
        .json({ message: "could not verify the user!" })
        .end();

    if (user.verify)
      return res.status(400).json({ message: "user is already verify!" }).end();

    if (user.id !== id)
      return res
        .status(400)
        .json({ message: "could not verify the user!" })
        .end();

    if (verification_code !== user.verification_code)
      return res
        .status(400)
        .json({
          message: "verification code doest not match! re-verify again",
        })
        .end();

    // user verify
    await updateUser({ _id: user._id }, { verify: true });

    return res
      .status(200)
      .json({
        message: `user with id ${user._id} is successfully verified`,
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

export async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await findAllUsers();

    if (!users)
      return res.status(400).json({ message: "there is no user" }).end();

    return res
      .status(200)
      .json({ message: "all users data", data: users })
      .end();
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}

export async function forgetPasswordHandler(
  req: Request<{}, {}, CreateForgetPasswordInput>,
  res: Response
) {
  try {
    const email = req.body.email;

    // find user by email
    const user = await findUser({ email });

    // check credentials to send forget password
    if (!user)
      return res
        .status(400)
        .json({ message: "could not verify the user!" })
        .end();

    if (!user.verify)
      return res
        .status(400)
        .json({ message: "user is not verified yet!" })
        .end();

    const password_reset_code = crypto.randomUUID().toString();

    sendEmail({
      from: "arkar1712luffy@gmail.com",
      to: user.email,
      subject: "password reset code",
      text: `password reset code: ${password_reset_code} 
             ID: ${user._id}`,
    });

    await updateUser({ _id: user._id }, { password_reset_code });

    return res
      .status(200)
      .json({ message: "successfully send password reset code" })
      .end();
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}

export async function resetPasswordHandler(
  req: Request<
    CreateResetPasswordInput["params"],
    {},
    Omit<CreateResetPasswordInput["body"], "confirm_password">
  >,
  res: Response
) {
  try {
    const { id, password_reset_code } = req.params;
    const password = req.body.password;

    // find user by email
    const user = await findUserById(id);

    // check credentials to send forget password
    if (!user)
      return res
        .status(400)
        .json({ message: "could not reset password for the user!" })
        .end();

    if (!user.verify)
      return res
        .status(400)
        .json({ message: "user is not verified yet!" })
        .end();

    if (user.id !== id)
      return res
        .status(400)
        .json({ message: "could not reset password for the user!" })
        .end();

    if (user.password_reset_code !== password_reset_code)
      return res
        .status(400)
        .json({
          message:
            "password reset code doest not match! try again with valid reset code",
        })
        .end();

    const hash_password = await argon2.hash(password);

    await updateUser(
      { _id: user._id },
      { password_reset_code: null, password: hash_password }
    );

    return res
      .status(200)
      .json({ message: "successfully reset the user password" })
      .end();
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}

export async function getSessionUser(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    if (!user)
      return res
        .status(403)
        .json({ message: "user session expired! refresh the session token" });

    return res.status(200).json({ user });
  } catch (e: any) {
    if (e instanceof MongooseError)
      return res.status(500).json({ error: e.message }).end();
    if (e instanceof ZodError)
      return res.status(500).json({ error: e.message }).end();
    return res.status(500).json({ error: e.message }).end();
  }
}
