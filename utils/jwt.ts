import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";
export function signJWT(
  payload: Object,
  options?: SignOptions | undefined,
  key?: "ACCESS_TOKEN_PRIVATE_KEY" | "REFRESH_TOKEN_PRIVATE_KEY "
) {
  const signInKey = Buffer.from(
    config.get<string>(key as string),
    "base64"
  ).toString("ascii");

  return jwt.sign(payload, signInKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJWT<T>(
  toke: string,
  key?: "ACCESS_TOKEN_PUBLIC_KEY" | "REFRESH_TOKEN_PUBLIC_KEY"
): T | null {
  const keyToVerify = Buffer.from(
    config.get<string>(key as string),
    "base64"
  ).toString("ascii");
  try {
    const decoded = jwt.verify(toke, keyToVerify) as T;

    return decoded;
  } catch (e) {
    return null;
  }
}
