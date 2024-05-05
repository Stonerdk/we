import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { auth, firebaseConfig } from "@/firebase/firebasedb";

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
        const { email, password } = credentials!;

        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          return { ...user, id: user.uid };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  adapter: FirestoreAdapter(firebaseConfig),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.uid;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.uid) {
        const u = session.user;
        session.user.uid = token.uid;
      }
      return session;
    },
  },

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
