import { z } from "zod";

export const Email = z.string().email().brand<"Email">();
export type Email = z.infer<typeof Email>;
