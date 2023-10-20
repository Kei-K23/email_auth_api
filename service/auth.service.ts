import { omit } from "lodash";
import { SessionModel } from "../model/session.model";
import { PRIVATE_FIELDS, UserDocument } from "../model/user.model";
import { signJWT } from "../utils/jwt";
import { MongooseError } from "mongoose";

export async function findSessionByID(id: string) {
  try {
    return await SessionModel.findById(id);
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message);
    throw new Error(e.message);
  }
}

async function createSession(user_id: string) {
  try {
    return await SessionModel.create({ user_id });
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message);
    throw new Error(e.message);
  }
}

export function signAccessToken(user: Omit<UserDocument, "verifyPassword">) {
  const payload = omit(user.toJSON(), PRIVATE_FIELDS);

  const access_token = signJWT(
    payload,
    { expiresIn: "1m" },
    "ACCESS_TOKEN_PRIVATE_KEY"
  );

  return access_token;
}

export async function refreshToken(user_id: string) {
  const session = await createSession(user_id);

  const refresh_token = signJWT(
    {
      session: session._id,
    },
    { expiresIn: "1y" },
    "REFRESH_TOKEN_PRIVATE_KEY"
  );

  return refresh_token;
}
