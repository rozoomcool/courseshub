import { $Enums } from "@prisma/client";

export type UserModel = {
  id?: number;
  username: string;
  password: string;
  role?: $Enums.Role | null
}

export enum Role {
  ADMIN, MODERATOR, USER
}