import NextAuth, { DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signInSchema } from './schemas/data-schemas';

// Extend the Session and User types to include isAdmin
declare module 'next-auth' {
  interface Session {
    user: {
      isAdmin?: boolean;
    } & DefaultSession['user'];
  }
  interface User {
    isAdmin?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials using Zod schema
          const { email, password } = signInSchema.parse(credentials);

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          // Return user object (exclude password for security)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // Always include user id in session
      if (user && session.user) {
        session.user.id = user.id;
        session.user.isAdmin = user.isAdmin;
      }
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt', // Required for credentials provider
  },
});
