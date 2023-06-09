import { z } from "zod";

export const Password = z
  .string()
  .min(8)
  .max(24)
  .refine((p) => /[!@#$%^&*()]/.test(p))
  .brand<"Password">();

export type Password = z.infer<typeof Password>;
