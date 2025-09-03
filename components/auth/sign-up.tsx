'use client';

import { githubLogin, registerUser } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpSchema } from '@/schemas/data-schemas';
import type { SignUpProps } from '@/types/data-types';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import { toast } from 'sonner';

interface SignUpComponentProps {
  onSwitchToSignIn?: () => void;
}

const SignUp = ({ onSwitchToSignIn }: SignUpComponentProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as SignUpProps,
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await registerUser(value);
        toast.success('Welcome! Your account has been created successfully.', {
          duration: 4000,
          position: 'top-center',
        });
        router.push('/profile');
      } catch (error) {
        // User-friendly error messages
        let errorMessage = 'Unable to create account. Please try again.';
        
        if (error instanceof Error) {
          if (error.message.includes('already exists')) {
            errorMessage = error.message;
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Connection error. Please check your internet and try again.';
          } else if (error.message.includes('password')) {
            errorMessage = error.message;
          } else {
            errorMessage = error.message;
          }
        }
        
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-center',
          description: 'Having trouble? Try signing in if you already have an account.',
        });
      }
    },
  });

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>Sign Up</CardTitle>
        <CardDescription>
          Let&apos;s get you started – just a few details to create your account!
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Credentials Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className='space-y-4'
        >
          <form.Field name='name'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder='Enter your name'
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name='email'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder='Enter your email'
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name='password'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  type='password'
                  id='password'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder='Enter your password'
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name='confirmPassword'>
            {(field) => (
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  type='password'
                  id='confirmPassword'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder='Confirm your password'
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <Button type='submit' className='w-full' disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? 'Creating your account...' : 'Create account'}
          </Button>

          {/* Register link */}
          <div className='text-center text-sm text-muted-foreground'>
            Have an account?{' '}
            <button
              type='button'
              className='text-primary underline hover:text-primary/80 cursor-pointer'
              onClick={onSwitchToSignIn}
            >
              Log in here!
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
          </div>
        </div>

        {/* GitHub Login */}
        <Button variant='outline' onClick={githubLogin} className='w-full'>
          <FaGithub className='mr-2 h-4 w-4' />
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignUp;
