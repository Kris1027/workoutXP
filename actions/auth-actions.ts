'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { signInSchema, signUpSchema } from '@/schemas/data-schemas';
import { SignInProps, SignUpProps } from '@/types/data-types';
import { saltAndHashPassword } from '@/utils/salt-and-hash-password';
import { AuthError } from 'next-auth';
import { DEFAULT_ACCOUNT_IMAGE } from '@/constants/app-constants';

export const githubLogin = async () => {
  await signIn('github', { redirectTo: '/profile' });
};

export const logout = async () => {
  await signOut({ redirect: false });
};

export const loginWithCredentials = async (credentials: SignInProps) => {
  const result = signInSchema.safeParse(credentials);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0] || 'Please check your input and try again.';
    throw new Error(firstError);
  }

  try {
    await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
  } catch (error) {
    // Log error for debugging (without sensitive data)
    console.error('Login attempt failed:', {
      timestamp: new Date().toISOString(),
      errorType: error instanceof AuthError ? error.type : 'Unknown',
    });

    // Handle AuthError specifically with user-friendly messages
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid email or password. Please check your credentials.');
        case 'CallbackRouteError':
          throw new Error('Invalid email or password. Please check your credentials.');
        case 'AccessDenied':
          throw new Error('Access denied. Your account may be restricted.');
        default:
          throw new Error('Unable to sign in. Please try again or contact support.');
      }
    }

    // Generic error fallback
    throw new Error('Unable to sign in. Please check your connection and try again.');
  }
};

export const registerUser = async (credentials: SignUpProps) => {
  const { name, email, password } = credentials;

  const result = signUpSchema.safeParse(credentials);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0] || 'Please check your input and try again.';
    throw new Error(firstError);
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const hashedPassword = await saltAndHashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email,
        image: DEFAULT_ACCOUNT_IMAGE,
        password: hashedPassword,
        isAdmin: false,
      },
    });

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
    } catch (signInError) {
      console.error('Auto sign-in after registration failed:', signInError);
      // Don't throw here - registration was successful
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        throw error;
      }
      if (error.message.includes('prisma') || error.message.includes('database')) {
        throw new Error('Unable to create account. Please try again later.');
      }
    }
    
    throw new Error('Registration failed. Please check your information and try again.');
  }
};
