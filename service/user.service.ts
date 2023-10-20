import { FilterQuery, MongooseError, UpdateQuery } from "mongoose";
import { IUser, UserDocument, UserModel } from "../model/user.model";
import { isEmpty } from "lodash";

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

export async function findUser(query: FilterQuery<UserDocument>) {
  try {
    const user = await UserModel.findOne(query);
    if (!user) throw new Error("User not found");

    return user;
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message);
    throw new Error(e.message);
  }
}

export async function findAllUsers() {
  try {
    const users = await UserModel.find();
    if (isEmpty(users)) throw new Error("Users not found");

    return users;
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message);
    throw new Error(e.message);
  }
}

export async function updateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>
) {
  try {
    const updated_user = await UserModel.findOneAndUpdate(query, update);
    if (!updated_user) throw new Error("User not found");

    return updated_user;
  } catch (e: any) {
    if (e instanceof MongooseError) throw new Error(e.message);
    throw new Error(e.message);
  }
}
