import { FilterQuery, MongooseError, UpdateQuery } from "mongoose";
import { IUser, UserDocument, UserModel } from "../model/user.model";

export async function createUser(input: Partial<IUser>) {
  try {
    return await UserModel.create(input);
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message);
    throw new Error(e.message);
  }
}

export async function findUserById(id: string) {
  try {
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User not found");

    return user;
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message);
    throw new Error(e.message);
  }
}

// export async function updateUser(
//   query: FilterQuery<UserDocument>,
//   update: UpdateQuery<UserDocument>
// ) {
//   try {
//     const updated_user = await UserModel.findOneAndUpdate(query, update);
//     if (!updated_user) throw new Error("User not found");

//     return updated_user;
//   } catch (e: any) {
//     if (e instanceof MongooseError) throw new Error(e.message);
//     throw new Error(e.message);
//   }
// }
