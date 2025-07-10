'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  async function handleCredentialsSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else if (res?.ok) {
      window.location.href = '/profile';
    }
  }

  async function handleGithubSignIn() {
    setLoading(true);
    await signIn('github', { callbackUrl: '/profile' });
    setLoading(false);
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded-md shadow'>
      <h2 className='text-2xl font-bold mb-4'>Sign In</h2>
      {error && <div className='mb-4 text-red-600'>{error}</div>}
      {searchParams.get('error') && (
        <div className='mb-4 text-red-600'>{searchParams.get('error')}</div>
      )}
      <form onSubmit={handleCredentialsSignIn} className='space-y-4'>
        <div>
          <label htmlFor='email' className='block text-sm font-medium mb-1'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            required
            className='w-full px-3 py-2 border rounded-md'
          />
        </div>
        <div>
          <label htmlFor='password' className='block text-sm font-medium mb-1'>
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            required
            className='w-full px-3 py-2 border rounded-md'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700'
          disabled={loading}
        >
          Sign In
        </button>
      </form>
      <div className='my-4 text-center text-gray-500'>or</div>
      <button
        onClick={handleGithubSignIn}
        className='w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900'
        disabled={loading}
      >
        Sign in with GitHub
      </button>
      <div className='mt-4 text-center'>
        <span>Don&apos;t have an account? </span>
        <Link href='/profile'>Register</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className='max-w-md mx-auto mt-10 p-6 text-center'>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
