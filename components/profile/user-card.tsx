import { fetchUserById } from '@/actions/user-actions';
import { fetchWorkoutsByUserId } from '@/actions/workout-actions';
import { auth } from '@/auth';
import AuthContainer from '@/components/auth/auth-container';
import SignOut from '@/components/auth/sign-out';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/utils/format-date';
import { getUserInitials } from '@/utils/get-user-initials';
import { Calendar, Mail, Settings, User, Dumbbell } from 'lucide-react';

const UserCard = async () => {
  const session = await auth();
  const currentUser = await fetchUserById(session?.user?.id || '');
  const userWorkouts = currentUser ? await fetchWorkoutsByUserId(currentUser.id) : [];

  return (
    <div className='flex items-center justify-center p-6'>
      {!currentUser && (
        <div className='w-full max-w-md'>
          <AuthContainer />
        </div>
      )}
      {currentUser && (
        <Card className='w-full max-w-md'>
          <CardHeader className='flex flex-col justify-center items-center pb-2'>
            <Avatar className='w-24 h-24 border-4 border-violet-400 shadow-lg'>
              {currentUser?.image ? (
                <AvatarImage
                  src={currentUser.image}
                  alt={currentUser.name || 'User'}
                  className='object-cover'
                />
              ) : null}
              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold'>
                {currentUser?.name ? (
                  getUserInitials(currentUser.name)
                ) : (
                  <User className='w-8 h-8' />
                )}
              </AvatarFallback>
            </Avatar>
            <CardTitle className='text-2xl font-bold mb-1'>
              {currentUser?.name || 'Anonymous User'}
            </CardTitle>
            <Badge variant={currentUser.isAdmin ? 'destructive' : 'secondary'} className='mb-2'>
              {currentUser.isAdmin ? 'Admin' : 'User'}
            </Badge>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 p-3 rounded-lg border border-gray-700'>
                <div className='flex-shrink-0'>
                  <Mail className='w-5 h-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium'>Email</p>
                  <p className='text-sm truncate'>{currentUser?.email || 'No email provided'}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg border border-gray-700'>
                <div className='flex-shrink-0'>
                  <User className='w-5 h-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium'>Full Name</p>
                  <p className='text-sm'>{currentUser.name || 'Not specified'}</p>
                </div>
              </div>

              {currentUser.createdAt && (
                <div className='flex items-center gap-3 p-3 rounded-lg border border-gray-700'>
                  <div className='flex-shrink-0'>
                    <Calendar className='w-5 h-5' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium'>Member Since</p>
                    <p className='text-sm'>{formatDate(new Date(currentUser.createdAt))}</p>
                  </div>
                </div>
              )}
            </div>

            <div className='flex items-center gap-3 p-3 rounded-lg border border-gray-700'>
              <div className='flex-shrink-0'>
                <Dumbbell className='w-5 h-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium'>Workouts</p>
                <p className='text-sm'>{userWorkouts?.length ?? 0}</p>
              </div>
            </div>

            <Separator className='my-6' />

            <div className='flex gap-3'>
              <Button variant='outline' className='flex-1' size='sm' disabled>
                <Settings className='w-4 h-4 mr-2' />
                Edit Profile
              </Button>
              <SignOut />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserCard;
