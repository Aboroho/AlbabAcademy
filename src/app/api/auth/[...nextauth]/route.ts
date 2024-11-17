// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
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

  // 3. Pages Configuration
  pages: {
    signIn: "/login", // Custom sign-in page
    error: "/login", // Custom error page
    // signOut: '/auth/signout', // Custom sign-out page
    // verifyRequest: '/auth/verify-request', // Used for email verification
  },

  // 4. Session Configuration
  session: {
    strategy: "jwt", // Use JWT strategy instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // Session expires in 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },

  // 5. JWT Configuration
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Secret key for JWT signing
    // maxAge: 30 * 24 * 60 * 60,        // Optional: Set different JWT expiry
    // async encode() { ... }            // Optional: Custom JWT encoding
    // async decode() { ... }            // Optional: Custom JWT decoding
  },

  // 6. Additional Options
  secret: process.env.NEXTAUTH_SECRET, // Global secret for cookie signing
  debug: process.env.NODE_ENV === "development", // Enable debug messages
  // events: {                           // Optional: Hook into auth events
  //   async signIn({ user }) { ... },
  //   async signOut({ session }) { ... },
  // },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
