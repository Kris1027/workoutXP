'use client';

import { logout } from '@/actions/auth-actions';
import { Button } from '../ui/button';

const SignOut = () => {
  return <Button onClick={() => logout()}>Sign out</Button>;
};

export default SignOut;
