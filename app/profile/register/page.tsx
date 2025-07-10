'use client';

import { registerUser } from '@/actions/auth-actions';

export default function RegisterPage() {
  async function handleRegister(formData: FormData) {
    await registerUser(formData);
    // Optionally handle errors here if you want to show them in the UI
  }

  return (
    <form action={handleRegister} className='space-y-4 max-w-md mx-auto'>
      <h2 className='text-2xl font-bold'>Create Account</h2>

      <div>
        <label htmlFor='name' className='block text-sm font-medium mb-1'>
          Full Name
        </label>
        <input
          id='name'
          name='name'
          type='text'
          required
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div>
        <label htmlFor='email' className='block text-sm font-medium mb-1'>
          Email
        </label>
        <input
          id='email'
          name='email'
          type='email'
          required
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div>
        <label htmlFor='confirmPassword' className='block text-sm font-medium mb-1'>
          Confirm Password
        </label>
        <input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          required
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <button
        type='submit'
        className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        Create Account
      </button>
    </form>
  );
}
