import { profile } from "console";
import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().min(1),
  name: z
    .string()
    .min(3, { message: "MINIMUM 3 CHARACTERS" })
    .max(30, { message: "MAXIMUM 30 CHARACTERS" }),
  username: z
    .string()
    .min(3, { message: "MINIMUM 3 CHARACTERS" })
    .max(30, { message: "MAXIMUM 30 CHARACTERS" }),
  bio: z
    .string()
    .min(10, { message: "MINIMUM 10 CHARACTERS" })
    .max(1000, { message: "MAXIMUM 30 CHARACTERS" }),
});
