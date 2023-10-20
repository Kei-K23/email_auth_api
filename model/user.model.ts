import mongoose, { Model, Schema } from "mongoose";
import argon2 from "argon2";
import { logger } from "../utils/logger";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  verification_code?: string;
  password_reset_code?: string | null;
  verify: boolean;
  verifyPassword: (candidatePassword: string) => Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
  password: string;
  verifyPassword: (
    auth_password: string,
    candidatePassword: string
  ) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: [true, "user name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      validate: [
        {
          validator: async function (value: string) {
            const existEmail = await UserModel.findOne({ email: value });
            if (existEmail) throw new Error("duplicate email");
            return true;
          },
          message: (prop) => `${prop.value} is already exist`,
        },
        {
          validator: function (value: string) {
            const emailRegex =
              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailRegex.test(value);
          },
          message: (prop) => `${prop.value} is not valid format`,
        },
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [6, "password must be at least 6 length"],
    },
    verification_code: {
      type: String,
      required: true,
      default: () => crypto.randomUUID().toString(),
    },
    password_reset_code: {
      type: Schema.Types.UUID,
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const hash_password = await argon2.hash(this.password);
  this.password = hash_password;
  next();
});

UserSchema.static(
  "verifyPassword",
  async function verifyPassword(
    auth_password: string,
    candidatePassword: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(auth_password, candidatePassword);
    } catch (e) {
      logger.error("Something went wrong, ", e);
      return false;
    }
  }
);

export const UserModel = mongoose.model<UserDocument, UserModel>(
  "User",
  UserSchema
);
