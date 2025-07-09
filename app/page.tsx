import { auth } from '@/auth';
import SignIn from '@/components/auth/sign-in';
import SignOut from '@/components/auth/sign-out';

const HomePage = async () => {
  const session = await auth();

  if (session?.user) {
    return <SignOut />;
  } else {
    return <SignIn />;
  }
};

export default HomePage;
