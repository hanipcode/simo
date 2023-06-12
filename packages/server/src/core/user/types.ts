import { z } from "zod";
import { Email } from "../types/email";
import { Password } from "../types/password";
import { Username } from "../types/username";

export const BaseUser = z.object({
  id: z.number(),
  email: Email,
  username: Username,
  password: Password,
});

export type BaseUser = z.infer<typeof BaseUser>;

export const User = BaseUser.strict().brand<"User">();

export type User = z.infer<typeof User>;
export type zzuzu = keyof User;

export const CreateUser = BaseUser.omit({
  id: true,
})
  .strict()
  .brand<"CreateUser">();

export type CreateUser = z.infer<typeof CreateUser>;

export const UserOutput = BaseUser.omit({
  password: true,
})
  .strict()
  .brand<"UserOutput">();

export const LoginUser = BaseUser.pick({
  email: true,
  password: true,
})
  .strict()
  .brand("LoginUser");
export type LoginUser = z.infer<typeof LoginUser>;

export const LoginUserOutput = BaseUser.omit({ password: true })
  .extend({
    accessToken: z.string(),
  })
  .strict()
  .brand("LoginUserOutput");

export type UserOutput = z.infer<typeof UserOutput>;
