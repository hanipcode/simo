import { z } from "zod";
import { Email } from "../types/email";
import { Password } from "../types/password";
import { Username } from "../types/username";

export const User = z
  .object({
    email: Email,
    username: Username,
    password: Password,
  })
  .brand<"User">();

export type User = z.infer<typeof User>;
