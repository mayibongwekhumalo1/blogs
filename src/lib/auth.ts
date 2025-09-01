import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/(auth)/[...nextauth]";

export const getSession = () => {
  return getServerSession(authOptions);
};

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user;
};