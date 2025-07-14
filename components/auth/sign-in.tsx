'use client';

import { githubLogin, loginWithCredentials } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logoUrl } from '@/constants/constants';
import { signInSchema } from '@/schemas/data-schemas';
import { useForm } from '@tanstack/react-form';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { toast } from 'sonner';

const SignIn = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: signInSchema,
      onSubmit: signInSchema,
    },
    onSubmit: async (value) => {
      const formData = new FormData();
      formData.append('email', value.value.email);
      formData.append('password', value.value.password);
      const result = await loginWithCredentials(formData);

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Successfully signed in!');
    },
  });

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>Sign In</CardTitle>
        <CardDescription>Please provide your credentials to login</CardDescription>
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
                  type='email'
                  id='email'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='Enter your email'
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 text-sm italic'>
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
                  placeholder='Enter your password'
                />
                {!field.state.meta.isValid && (
                  <p className='text-red-500 text-sm italic'>
                    {field.state.meta.errors
                      .map((error) => (typeof error === 'string' ? error : error?.message))
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <Button type='submit' className='w-full'>
            Sign in
          </Button>
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
