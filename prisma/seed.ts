import { Prisma, PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

const exerciseData: Prisma.ExerciseCreateInput[] = [
  {
    name: 'Incline Chest Fly',
    category: 'Chest',
    difficulty: 'Intermediate',
    ImageUrl:
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682b9cdc0023420f850c/view?project=gym-app&mode=admin',
    description:
      'An exercise that targets the upper chest muscles by performing a fly motion on an incline bench.',
  },
  {
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    difficulty: 'Beginner',
    ImageUrl:
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682b9fc900131446e9a5/view?project=gym-app&mode=admin',
    description:
      'An exercise that targets the shoulders by pressing dumbbells overhead on an incline bench.',
  },
  {
    name: 'Butterfly Machine',
    category: 'Chest',
    difficulty: 'Beginner',
    ImageUrl:
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682b9e860039f0f5c82f/view?project=gym-app&mode=admin',
    description:
      'A machine-based exercise that targets the chest muscles by performing a butterfly motion.',
  },
  {
    name: 'Seated Overhead Dumbbell Press',
    category: 'Shoulders',
    difficulty: 'Advanced',
    ImageUrl:
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba1580028ac3bbc20/view?project=gym-app&mode=admin',
    description:
      'An exercise that targets the shoulders by pressing dumbbells overhead while seated.',
  },
  {
    name: 'Rope Cable Triceps Extension',
    category: 'Shoulders',
    difficulty: 'Intermediate',
    ImageUrl:
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba3a3001abb20648e/view?project=gym-app&mode=admin',
    description:
      'An exercise that targets the triceps by extending a rope attachment on a cable machine overhead.',
  },
  {
    name: 'Bench Press',
    category: 'Chest',
    difficulty: 'Intermediate',
    ImageUrl:
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682c36f300035fc51c05/view?project=gym-app&mode=admin',
    description:
      'A compound exercise that targets the chest, shoulders, and triceps by pressing a barbell from the chest to an extended position.',
  },
  {
    name: 'Incline Bench Press',
    category: 'Chest',
    difficulty: 'Intermediate',
    ImageUrl:
      'https://fra.cloud.appwrite.io/v1/storage/buckets/exercise-images-storage/files/682ba3ad000bc1f48ab2/view?project=gym-app&mode=admin',
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
