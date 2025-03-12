import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prismaQ } from "../../utils/prisma";
import bcrypt from "bcrypt";
export const authOptions: NextAuthOptions = {
  // 1. Providers Configuration
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // Your user lookup and verification logic
        const user = await prismaQ.user.findUnique({
          where: { username: credentials.username },
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

        if (
          !user ||
          !(await bcrypt.compare(credentials.password, user.password))
        ) {
          throw new Error("Invalid credentials");
        }

        // Return user object that will be saved in the token
        return {
          id: user.id.toString(),
          user_id: user.id,
          username: user.username,
          avatar: user.avatar,
          email: user.email,
          role: user.role,
          permissions: user.permissions.map((p) => ({
            status: p.permission_status,
            ...p.permission,
          })),
        };
      },
    }),
  ],

  // 2. Callbacks Configuration
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Pass all user data to token
        return { ...token, ...user };
      }
      return token;
    },

    async session({ session, token }) {
      // Pass all token data to session
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Session expires in 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  // 5. JWT Configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },

  // 6. Additional Options
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
