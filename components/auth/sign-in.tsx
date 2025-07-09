'use client';

import { login } from '@/actions/auth-actions';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const SignIn = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in with Github</CardTitle>
        <CardDescription>Please sign in to continue using WorkoutXP</CardDescription>
        <CardContent>
          <Button onClick={() => login()}>Sign in with GitHub</Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default SignIn;
