import NextAuth, { NextAuthOptions, Session, User as NextAuthUser, SessionStrategy } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      role?: string;
    } & NextAuthUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return { id: user._id, email: user.email, role: user.role, name: user.name };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            provider: account.provider,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
