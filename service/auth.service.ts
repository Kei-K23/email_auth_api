import { SessionModel } from "../model/session.model";
import { UserDocument } from "../model/user.model";
import { signJWT } from "../utils/jwt";

async function createSession(user_id: string) {
  return await SessionModel.create({ user_id });
}

export function signAccessToken(user: Omit<UserDocument, "verifyPassword">) {
  const payload = user.toJSON();

  const access_token = signJWT(payload, undefined, "ACCESS_TOKEN_PRIVATE_KEY");

  return access_token;
}

export async function refreshToken(user_id: string) {
  const session = await createSession(user_id);

  const refresh_token = signJWT(
    {
      session: session._id,
    },
    undefined,
    "REFRESH_TOKEN_PRIVATE_KEY"
  );

  return refresh_token;
}
