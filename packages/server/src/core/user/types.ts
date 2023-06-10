import { z } from "zod";
import { Email } from "../types/email";
import { Password } from "../types/password";
import { Username } from "../types/username";

const BaseUser = z.object({
  id: z.number(),
  email: Email,
  username: Username,
  password: Password,
});

export const User = BaseUser.strict().brand<"User">();

export type User = z.infer<typeof User>;
export type zzuzu = keyof User;

export const CreateUser = BaseUser.omit({
  id: true,
}).brand<"CreateUser">();

export type CreateUser = z.infer<typeof CreateUser>;

export const UserOutput = BaseUser.omit({
  password: true,
}).brand<"UserOutput">();

export type UserOutput = z.infer<typeof UserOutput>;
