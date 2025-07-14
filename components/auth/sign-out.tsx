'use client';

import { logout } from '@/actions/auth-actions';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Successfully signed out!');
      router.push('/');
    } catch (error) {
      toast.error('Sign out failed. Please try again.');
      console.error('Error signing out:', error);
    }
  };

  return <Button onClick={handleSignOut}>Sign out</Button>;
};

export default SignOut;
