import { z } from "zod";

export const Username = z
  .string()
  .min(4)
  .regex(/^[A-Za-z0-9][A-Za-z@!#\$\:\%\.\^0-9]+$/gim);

export type Username = z.infer<typeof Username>;
