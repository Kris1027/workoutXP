'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { signInSchema } from '@/schemas/data-schemas';
import { SignInProps, SignUpProps } from '@/types/data-types';
import { saltAndHashPassword } from '@/utils/salt-and-hash-password';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export const githubLogin = async () => {
  await signIn('github', { redirectTo: '/profile' });
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
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
    return { success: true };
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

export const registerUser = async (
  credentials: SignUpProps
): Promise<{ error: string; fieldErrors?: any } | void> => {
  const { name, email, password, confirmPassword } = credentials;

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    return {
      error: 'All fields are required',
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  // Validate email and password format
  const result = signInSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      error: 'Invalid email or password format',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: 'User with this email already exists',
      };
    }

    // Hash the password
    const hashedPassword = await saltAndHashPassword(password);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: false, // Default to non-admin
      },
    });

    // Automatically sign in the user after registration
    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/',
      });
    } catch (signInError) {
      // If sign in fails after registration, still consider registration successful
      if (signInError instanceof Error && signInError.message.includes('NEXT_REDIRECT')) {
        redirect('/');
      }
      console.error('Auto sign-in after registration failed:', signInError);
      // Don't throw here, registration was successful
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      error: 'Something went wrong during registration. Please try again.',
    };
  }
};
