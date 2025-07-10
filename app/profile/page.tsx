import { auth } from '@/auth';
import SignOut from '@/components/auth/sign-out';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import RegisterPage from './register/page';

const ProfilePage = async () => {
  const session = await auth();

  if (session?.user) {
    return (
      <Card>
        <CardHeader>
          {session.user.image && (
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
          <CardTitle>User signed in with name: {session.user.name}</CardTitle>
          <CardDescription>User signed in with email: {session.user.email}</CardDescription>
          {session.user.isAdmin && (
            <Link href='/admin'>
              <Button>Admin Dashboard</Button>
            </Link>
          )}
          <SignOut />
        </CardContent>
      </Card>
    );
  } else {
    return (
      <div className='max-w-md mx-auto mt-10 p-6 border rounded-md shadow'>
        <RegisterPage />
        <div className='mt-4 text-center'>
          <span>Already have an account? </span>
          <Link href='profile/login'>Login</Link>
        </div>
      </div>
    );
  }
};

export default ProfilePage;
