import { auth } from '@/auth';
import NavigationBar from './navigation-bar';
import { fetchUserById } from '@/actions/user-actions';

const Navigation = async () => {
  const session = await auth();
  const currentUser = await fetchUserById(session?.user?.id || '');

  return <NavigationBar currentUser={currentUser} />;
};

export default Navigation;
