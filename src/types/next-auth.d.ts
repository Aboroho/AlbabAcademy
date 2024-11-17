import { PermissionStatus, Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

interface UserPermission {
  id: number;
  permission_name: string;
  description: string | null;
  status: PermissionStatus;
}

interface AuthUser {
  id: string;
  user_id: number; // Changed from string to number
  username: string;
  email?: string | null; // Added null possibility
  avatar?: string | null;
  role: Role; // Using Prisma Role enum
  permissions: UserPermission[];
}
declare module "next-auth" {
  interface Session {
    user: AuthUser & DefaultSession["user"];
  }
  type User = AuthUser;
}

declare module "next-auth/jwt" {
  type JWT = AuthUser;
}
