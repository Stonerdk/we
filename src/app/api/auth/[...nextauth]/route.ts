import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { signIn } from "../login/route";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "email@aaa.com",
        },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          email: credentials?.email,
          password: credentials?.password,
        });
        const user = res.data;
        console.log(user);

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     return { ...token, ...user };
  //   },

  //   async session({ session, token }) {
  //     session.user = token as any;
  //     return session;
  //   },
  // },
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
