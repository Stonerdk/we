// types/next-auth.d.ts
import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Represents the shape of the user object found within the session.
   * You can extend this interface to include any user properties.
   */
  interface User {
    uid: string;
  }

  /**
   * The shape of the session object.
   * Extend this interface to include any additional properties you need.
   */
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
  }
}
