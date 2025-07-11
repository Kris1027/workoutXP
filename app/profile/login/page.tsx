'use client';

import { loginWithCredentials } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInSchema } from '@/schemas/data-schemas';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';

const SignInComponent = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async (value) => {
      const formData = new FormData();
      formData.append('email', value.value.email);
      formData.append('password', value.value.password);
      await loginWithCredentials(formData);
      toast.success('Successfully signed in!');
    },
  });

  return (
    <Card>
      <CardTitle className='text-2xl font-bold mb-4'>Sign In</CardTitle>
      <CardDescription></CardDescription>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name='email'>
            {(field) => (
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  type='email'
                  id='email'
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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
              <div>
                <div>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    type='password'
                    id='password'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {!field.state.meta.isValid && (
                    <p className='text-red-500 italic'>
                      {field.state.meta.errors
                        .map((error) => (typeof error === 'string' ? error : error?.message))
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </form.Field>

          <Button>Sign in</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInComponent;
