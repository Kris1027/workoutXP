'use client';

import { githubLogin, loginWithCredentials } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInSchema } from '@/schemas/data-schemas';
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import type { SignInProps } from '@/types/data-types';

interface SignInComponentProps {
  onSwitchToSignUp?: () => void;
}

const SignIn = ({ onSwitchToSignUp }: SignInComponentProps) => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as SignInProps,
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await loginWithCredentials(value);
        toast.success('Welcome back! You have successfully signed in.', {
          duration: 4000,
        });
        router.push('/');
      } catch (error) {
        // User-friendly error messages
        let errorMessage = 'Unable to sign in. Please try again.';
        
        if (error instanceof Error) {
          if (error.message.includes('Invalid email or password')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Connection error. Please check your internet and try again.';
          } else if (error.message.includes('too many')) {
            errorMessage = 'Too many login attempts. Please try again later.';
          } else {
            errorMessage = error.message;
          }
        }
        
        toast.error(errorMessage, {
          duration: 5000,
          description: 'Need help? Contact support if the problem persists.',
        });
      }
    },
  });

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>Sign In</CardTitle>
        <CardDescription>
          Let&apos;s get you signed in – just your email and password.
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

          <Button type='submit' className='w-full' disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? 'One moment...' : 'Log in'}
          </Button>

          {/* Register link */}
          <div className='text-center text-sm text-muted-foreground'>
            Not a member yet?{' '}
            <button
              type='button'
              className='text-primary underline hover:text-primary/80 cursor-pointer'
              onClick={onSwitchToSignUp}
            >
              Register
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

export default SignIn;
