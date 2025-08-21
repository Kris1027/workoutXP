'use client';

import Link from 'next/link';
import {
  FiArrowRight,
  FiCheckCircle,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiActivity,
  FiBarChart,
} from 'react-icons/fi';
import { LuDumbbell, LuTimer } from 'react-icons/lu';

const HomePage = () => {
  const features = [
    {
      icon: LuDumbbell,
      title: 'Exercise Library',
      description: 'Access hundreds of exercises with detailed instructions and tips',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FiTarget,
      title: 'Custom Workouts',
      description: 'Create personalized workout plans tailored to your goals',
      color: 'from-pink-500 to-orange-500',
    },
    {
      icon: FiBarChart,
      title: 'Track Progress',
      description: 'Monitor your fitness journey with detailed analytics',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Connect with fitness enthusiasts and share your achievements',
      color: 'from-blue-500 to-purple-500',
    },
  ];

  const benefits = [
    'Personalized workout recommendations',
    'Progress tracking and analytics',
    'Exercise video tutorials',
    'Community support and challenges',
    'Nutrition tips and meal plans',
    'Achievement badges and rewards',
  ];

  const stats = [
    { value: '500+', label: 'Exercises' },
    { value: '10K+', label: 'Active Users' },
    { value: '95%', label: 'Satisfaction' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative px-4 py-16 md:py-24 lg:py-32 overflow-hidden'>
        {/* Background decoration */}
        <div className='absolute inset-0 -z-10'>
          <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob' />
          <div className='absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000' />
          <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000' />
        </div>

        <div className='max-w-7xl mx-auto'>
          <div className='text-center space-y-8'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium'>
              <FiAward className='text-primary' />
              <span>Your fitness journey starts here</span>
            </div>

            {/* Main heading */}
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-black'>
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Transform Your Body
              </span>
              <br />
              <span className='bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent'>
                Level Up Your Life
              </span>
            </h1>

            {/* Subtitle */}
            <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
              Track workouts, crush goals, and join a community of fitness enthusiasts. Your
              personal trainer in your pocket.
            </p>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/exercises'
                className='inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200'
              >
                Start Training
                <FiArrowRight />
              </Link>
              <Link
                href='/workouts'
                className='inline-flex items-center justify-center gap-2 px-8 py-4 bg-background border-2 border-border hover:border-primary/50 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200'
              >
                Browse Workouts
                <LuDumbbell />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='px-4 py-12 border-y border-border/50'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  {stat.value}
                </div>
                <div className='text-sm text-muted-foreground mt-1'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='px-4 py-16 md:py-24'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-black mb-4'>
              Everything You Need to
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                {' '}
                Succeed
              </span>
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Powerful features designed to help you reach your fitness goals faster
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className='group p-6 bg-card border border-border rounded-2xl hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1'
                >
                  <div
                    className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                  <p className='text-sm text-muted-foreground'>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='px-4 py-16 md:py-24 bg-muted/30'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl md:text-4xl font-black mb-6'>
                Why Choose
                <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  {' '}
                  WorkoutXP?
                </span>
              </h2>
              <p className='text-lg text-muted-foreground mb-8'>
                Join thousands of users who have transformed their fitness journey with our
                comprehensive platform.
              </p>
              <ul className='space-y-4'>
                {benefits.map((benefit, index) => (
                  <li key={index} className='flex items-start gap-3'>
                    <FiCheckCircle className='text-green-500 mt-1 flex-shrink-0' size={20} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='relative'>
              <div className='bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='p-3 bg-white/20 rounded-xl'>
                    <FiActivity size={24} />
                  </div>
                  <div>
                    <div className='text-2xl font-bold'>Get Started Today</div>
                    <div className='opacity-90'>Free to join, upgrade anytime</div>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <LuTimer className='flex-shrink-0' />
                    <span>Quick 5-minute setup</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FiTrendingUp className='flex-shrink-0' />
                    <span>See results in weeks</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <FiUsers className='flex-shrink-0' />
                    <span>Join our community</span>
                  </div>
                </div>
                <Link
                  href='/profile'
                  className='inline-flex items-center justify-center gap-2 w-full mt-6 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transition-colors'
                >
                  Create Free Account
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='px-4 py-16 md:py-24'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-black mb-6'>
            Ready to Start Your
            <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              {' '}
              Fitness Journey?
            </span>
          </h2>
          <p className='text-lg text-muted-foreground mb-8'>
            Join WorkoutXP today and take the first step towards a healthier, stronger you.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/profile'
              className='inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200'
            >
              Get Started Free
              <FiArrowRight />
            </Link>
            <Link
              href='/exercises'
              className='inline-flex items-center justify-center gap-2 px-8 py-4 bg-background border-2 border-border hover:border-primary/50 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200'
            >
              Explore Exercises
            </Link>
          </div>
        </div>
      </section>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
