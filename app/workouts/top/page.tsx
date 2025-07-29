import { fetchTopWorkouts } from '@/actions/workout-actions';
import { auth } from '@/auth';
import { FaFire, FaFilter, FaUser, FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { UserProps } from '@/types/data-types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import WorkoutLikeButton from '@/components/workouts/workout-like-button';
import Image from 'next/image';

const TopWorkoutsPage = async () => {
  const session = await auth();
  const currentUser = session?.user as UserProps | null;
  const topWorkouts = await fetchTopWorkouts();

  const getRankingInfo = (index: number) => {
    if (index === 0) return { icon: FaTrophy, color: 'text-yellow-500', bgColor: 'bg-yellow-500', text: '#1' };
    if (index === 1) return { icon: FaMedal, color: 'text-gray-400', bgColor: 'bg-gray-400', text: '#2' };
    if (index === 2) return { icon: FaAward, color: 'text-orange-600', bgColor: 'bg-orange-600', text: '#3' };
    return { icon: null, color: 'text-gray-600', bgColor: 'bg-gray-600', text: `#${index + 1}` };
  };

  return (
    <div className='px-4 py-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <FaFire className='text-orange-500 text-3xl' />
            <div>
              <h1 className='text-3xl font-bold'>Top Workouts</h1>
              <p className='text-gray-600 dark:text-gray-400'>
                Most liked workouts by the community
              </p>
            </div>
          </div>
          <Link href='/workouts'>
            <Button variant='outline'>
              All Workouts
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Workouts List */}
      <div className='space-y-4'>
        {topWorkouts.map((workout, index) => {
          const ranking = getRankingInfo(index);
          const RankIcon = ranking.icon;
          
          return (
            <Card key={workout.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  {/* Ranking */}
                  <div className='flex flex-col items-center min-w-[60px]'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${ranking.bgColor}`}>
                      {ranking.text}
                    </div>
                    {RankIcon && (
                      <RankIcon className={`text-xl mt-1 ${ranking.color}`} />
                    )}
                  </div>

                  {/* Workout Image */}
                  <Link href={`/workouts/${workout.id}`} className='flex-shrink-0'>
                    <Image
                      src={workout.imageUrl}
                      alt={workout.name}
                      width={80}
                      height={80}
                      className='object-contain rounded-lg w-20 h-20 bg-gray-50 dark:bg-gray-800'
                    />
                  </Link>

                  {/* Workout Info */}
                  <div className='flex-1 min-w-0'>
                    <Link href={`/workouts/${workout.id}`} className='block'>
                      <h3 className='text-lg font-semibold hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate'>
                        {workout.name}
                      </h3>
                    </Link>
                    <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1'>
                      {workout.description}
                    </p>
                    
                    {/* Creator Info */}
                    <div className='flex items-center gap-2 mt-2'>
                      <Avatar className='w-6 h-6'>
                        <AvatarImage src={workout.user?.image || ''} />
                        <AvatarFallback className='text-xs'>
                          <FaUser />
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {workout.user?.name}
                      </span>
                      <Badge variant='secondary' className='text-xs'>
                        {workout.exercises.length} exercises
                      </Badge>
                    </div>
                  </div>

                  {/* Like Section */}
                  <div className='flex flex-col items-center gap-2'>
                    <WorkoutLikeButton
                      workoutId={workout.id!}
                      initialIsLiked={workout.isLikedByUser || false}
                      initialLikeCount={workout._count?.likes || 0}
                      isAuthenticated={!!currentUser}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {topWorkouts.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <FaFilter className='text-5xl mx-auto' />
          </div>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>
            No workouts found. Be the first to create and like some workouts!
          </p>
          <Link href='/workouts'>
            <Button>
              Browse All Workouts
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopWorkoutsPage;