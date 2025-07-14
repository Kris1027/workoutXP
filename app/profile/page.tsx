import { auth } from '@/auth';
import AuthContainer from '@/components/auth/auth-container';
import SignOut from '@/components/auth/sign-out';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const ProfilePage = async () => {
  const session = await auth();

  return (
    <div className='flex justify-center p-10'>
      {session?.user ? (
        <Card>
          <CardHeader>
            {session?.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'username'}
                width={48}
                height={48}
                className='rounded-full'
              />
            )}
          </CardHeader>
          <CardContent>
            <CardTitle>User signed in with name: {session?.user.name}</CardTitle>
            <CardDescription>User signed in with email: {session?.user.email}</CardDescription>
            <SignOut />
          </CardContent>
        </Card>
      ) : (
        <AuthContainer />
      )}
    </div>
  );
};

export default ProfilePage;
