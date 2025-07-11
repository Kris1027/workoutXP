'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { signInSchema } from '@/schemas/data-schemas';
import { saltAndHashPassword } from '@/utils/salt-and-hash-password';
import { AuthError } from 'next-auth';

export const githubLogin = async () => {
  await signIn('github', { redirectTo: '/profile' });
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
};

export const loginWithCredentials = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = signInSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      error: 'Invalid email or password format',
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/profile',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid email or password',
          };
        default:
          return {
            error: 'Something went wrong. Please try again.',
          };
      }
    }
    throw error;
  }
};

export const registerUser = async (
  formData: FormData
): Promise<{ error: string; fieldErrors?: any } | void> => {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

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
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return {
      error: 'Something went wrong during registration. Please try again.',
    };
  }
};
