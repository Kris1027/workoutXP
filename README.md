<p align="center">
  <img src="/public/logo.png" alt="WorkoutXP Logo" width="400"/>
</p>

# WorkoutXP

**Transform Your Fitness Journey**

WorkoutXP is a modern, feature-rich fitness platform that empowers users to create, discover, and track custom workout routines. Built with cutting-edge web technologies, it offers a seamless experience for fitness enthusiasts of all levels.

---

## 🎯 Current Features

### Core Functionality
- **🏋️ Exercise Library** - Comprehensive database of exercises with detailed descriptions, categories, and difficulty levels
- **💪 Custom Workouts** - Create personalized workout plans by combining exercises from the library
- **⏱️ Workout Timer** - Built-in timer system for tracking workout sessions with exercise completion tracking
- **📊 Progress Tracking** - Monitor completed workouts, track exercise completion rates, and view workout history
- **🏆 Top Workouts** - Discover the most popular community workouts based on likes and engagement

### User Experience
- **🔐 Authentication System** - Secure sign-up/sign-in with credentials or GitHub OAuth integration
- **👤 User Profiles** - Personalized profiles with custom avatars and workout statistics
- **❤️ Social Features** - Like and share workouts, view community contributions
- **🌓 Dark/Light Mode** - Seamless theme switching for comfortable viewing in any environment
- **📱 Responsive Design** - Fully optimized for desktop, tablet, and mobile devices

### Advanced Features
- **🖼️ Image Management** - Upload and manage images for exercises and workouts with cloud storage
- **🔍 Smart Search** - Filter and find exercises/workouts efficiently
- **📈 Statistics Dashboard** - View workout stats including total time, exercises completed, and completion rates
- **🎨 Modern UI Components** - Beautiful, animated interface with glass morphism effects and smooth transitions
- **⚡ Real-time Updates** - Instant feedback with optimistic UI updates and toast notifications

### Technical Highlights
- **🚀 Performance Optimized** - Server-side rendering, image optimization, and lazy loading
- **♿ Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
- **🛡️ Type Safety** - Full TypeScript implementation with Zod schema validation
- **🔒 Secure** - Password hashing, secure sessions, and environment variable protection
- **📝 Data Persistence** - PostgreSQL database with Prisma ORM for reliable data storage

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Modern utility-first styling

### Backend & Database
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database toolkit
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[NextAuth.js v5](https://authjs.dev/)** - Authentication solution

### UI/UX
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[TanStack Form](https://tanstack.com/form)** - Powerful form management

### Development Tools
- **[ESLint 9](https://eslint.org/)** - Code quality and consistency
- **[pnpm](https://pnpm.io/)** - Fast, efficient package management
- **[Zod](https://zod.dev/)** - Runtime type validation
- **[UploadThing](https://uploadthing.com/)** - File upload handling

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- PostgreSQL database

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Kris1027/workoutXP.git
cd workoutXP
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```
Configure your database connection, authentication secrets, and API keys.

4. **Initialize the database:**
```bash
pnpm prisma generate
pnpm prisma db push
```

5. **Run the development server:**
```bash
pnpm dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Run production build
- `pnpm lint` - Run ESLint
- `pnpm prisma studio` - Open Prisma Studio for database management

---

## 🎨 Features Showcase

### Modern Dashboard
- Clean, intuitive interface with real-time statistics
- Quick access to recent workouts and progress metrics
- Responsive cards with hover effects and animations

### Exercise Management
- Create, edit, and delete exercises with rich metadata
- Categorize by muscle groups and difficulty levels
- Visual feedback with modern button components

### Workout Sessions
- Start timed sessions with built-in countdown
- Track individual exercise completion
- View session history with detailed statistics

### User Experience
- Smooth page transitions and loading states
- Comprehensive error handling with user-friendly messages
- Consistent design language throughout the application

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Created with ❤️ by [Kris1027](https://github.com/Kris1027)

---

<p align="center">
  <strong>WorkoutXP - Where Fitness Meets Technology</strong>
</p>