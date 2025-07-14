'use client';

import { logout } from '@/actions/auth-actions';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SignOut = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        logout().then(() => {
          toast.success('Successfully signed out!');
          router.push('/');
        });
      }}
    >
      Sign out
    </Button>
  );
};

export default SignOut;
