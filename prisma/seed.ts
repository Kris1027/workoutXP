import type { ExerciseProps } from '@/types/data-types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exerciseData: ExerciseProps[] = [
  {
    name: 'Incline Chest Fly',
    category: 'Chest',
    difficulty: 'Intermediate',
    imageUrl: 'https://szqmv3habx.ufs.sh/f/FYhVXcwcWhNICkwomn0hM3lKBTWRXHASGJez5yw9Eda0gOhf',
    description:
      'An exercise that targets the upper chest muscles by performing a fly motion on an incline bench.',
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    difficulty: 'Beginner',
    imageUrl: 'https://szqmv3habx.ufs.sh/f/FYhVXcwcWhNICkwomn0hM3lKBTWRXHASGJez5yw9Eda0gOhf',
    description:
      'An exercise that targets the shoulders by pressing dumbbells overhead on an incline bench.',
  },
  {
    name: 'Butterfly Machine',
    category: 'Chest',
    difficulty: 'Beginner',
    imageUrl: 'https://szqmv3habx.ufs.sh/f/FYhVXcwcWhNICkwomn0hM3lKBTWRXHASGJez5yw9Eda0gOhf',
    description:
      'A machine-based exercise that targets the chest muscles by performing a butterfly motion.',
  },
  {
    name: 'Seated Overhead Dumbbell Press',
    category: 'Shoulders',
    difficulty: 'Advanced',
    imageUrl: 'https://szqmv3habx.ufs.sh/f/FYhVXcwcWhNICkwomn0hM3lKBTWRXHASGJez5yw9Eda0gOhf',
    description:
      'An exercise that targets the shoulders by pressing dumbbells overhead while seated.',
  },
  {
    name: 'Rope Cable Triceps Extension',
    category: 'Shoulders',
    difficulty: 'Intermediate',
    imageUrl: 'https://szqmv3habx.ufs.sh/f/FYhVXcwcWhNICkwomn0hM3lKBTWRXHASGJez5yw9Eda0gOhf',
    description:
      'An exercise that targets the triceps by extending a rope attachment on a cable machine overhead.',
  },
  {
    name: 'Bench Press',
    category: 'Chest',
    difficulty: 'Intermediate',
    imageUrl: 'https://szqmv3habx.ufs.sh/f/FYhVXcwcWhNICkwomn0hM3lKBTWRXHASGJez5yw9Eda0gOhf',
    description:
      'A compound exercise that targets the chest, shoulders, and triceps by pressing a barbell from the chest to an extended position.',
  },
  {
    name: 'Incline Bench Press',
    category: 'Chest',
    difficulty: 'Intermediate',
    imageUrl: 'https://szqmv3habx.ufs.sh/f/FYhVXcwcWhNICkwomn0hM3lKBTWRXHASGJez5yw9Eda0gOhf',
    description:
      'A variation of the bench press that targets the upper chest by pressing a barbell from an inclined position.',
  },
];

export async function main() {
  for (const exercise of exerciseData) {
    await prisma.exercise.create({
      data: exercise,
    });
  }
  console.log('Seeded exercises successfully');
}

main()
  .catch((error) => {
    console.error('Error seeding exercises:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
