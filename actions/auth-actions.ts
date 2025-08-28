'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { signInSchema, signUpSchema } from '@/schemas/data-schemas';
import { SignInProps, SignUpProps } from '@/types/data-types';
import { saltAndHashPassword } from '@/utils/salt-and-hash-password';
import { AuthError } from 'next-auth';

const DEFAULT_ACCOUNT_IMAGE = '/default-account.jpg';

export const githubLogin = async () => {
  await signIn('github', { redirectTo: '/profile' });
};

export const logout = async () => {
  await signOut({ redirect: false });
};

export const loginWithCredentials = async (credentials: SignInProps) => {
  const result = signInSchema.safeParse(credentials);

  if (!result.success) {
    const flattened = result.error.flatten().fieldErrors;
    throw new Error('Validation failed: ' + JSON.stringify(flattened));
  }

  try {
    await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
  } catch (error) {
    console.error('Login attempt failed:', {
      email: credentials.email,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Handle AuthError specifically
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid email or password');
        case 'CallbackRouteError':
          throw new Error('Invalid email or password');
        default:
          throw new Error('Login failed. Please try again.');
      }
    }

    throw new Error('Login failed. Please try again.');
  }
};

export const registerUser = async (credentials: SignUpProps) => {
  const { name, email, password } = credentials;

  const result = signUpSchema.safeParse(credentials);

  if (!result.success) {
    const flattened = result.error.flatten().fieldErrors;
    throw new Error('Validation failed: ' + JSON.stringify(flattened));
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
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
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && error.message === 'User with this email already exists') {
      throw error;
    }
    throw new Error('Something went wrong during registration. Please try again.');
  }
};
