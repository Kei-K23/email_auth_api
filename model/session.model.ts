import mongoose, { Model } from "mongoose";

interface ISession {
  user_id: mongoose.ObjectId;
  valid: boolean;
}

export interface SessionDocument extends mongoose.Document, ISession {}

type SessionModel = Model<ISession>;

const SessionSchema = new mongoose.Schema<ISession, SessionModel>(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    valid: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const SessionModel = mongoose.model("Session", SessionSchema);
