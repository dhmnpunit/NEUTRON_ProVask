# Thryve Health Companion App

Thryve is a comprehensive health tracking and wellness companion app built with React Native and Expo. It helps users track their health metrics, maintain a health journal, complete challenges, and monitor their progress with a gamified approach.

![Thryve App](assets/thryve-logo.png)

## Features

- **Health Metrics Tracking**: Monitor sleep, water intake, mood, and activity levels
- **Daily Journal**: Record your health experiences and moods
- **Health Statistics**: Visualize your health data with intuitive charts and trends
- **Health Challenges**: Complete tasks and earn rewards through the "Flip Dice" challenge system
- **Achievements & Gamification**: Build streaks, earn health coins, and level up
- **AI-Powered Assistant**: Get personalized health guidance and tips

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with persistence
- **Backend & Authentication**: Supabase (PostgreSQL + Row Level Security)
- **UI Components**: Custom design system
- **Styling**: Native StyleSheet
- **Icons**: Lucide React Native & React Native Heroicons

## Project Structure

```
├── app/                    # Main application screens (Expo Router)
│   ├── (tabs)/             # Tab navigator screens
│   ├── auth/               # Authentication screens
│   ├── logs/               # Journal logs screens
│   └── profile/            # User profile screens
├── assets/                 # Static assets (images, fonts)
├── components/             # Reusable UI components
├── constants/              # App constants (colors, design system)
├── context/                # React Context providers
├── db/                     # Database utilities
├── lib/                    # Utility libraries
├── mocks/                  # Mock data for development
├── screens/                # Screen components
├── services/               # API services
├── store/                  # State management (Zustand)
├── supabase/               # Supabase configuration and migrations
└── types/                  # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or Yarn
- Expo CLI
- Supabase account (for backend)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/thryve.git
cd thryve
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npx expo start
```

## Environment Setup

The app requires the following environment variables:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

See `ENV_SETUP.md` for detailed setup instructions.

## Database Schema

The app uses Supabase with the following main tables:

- **profiles**: User profiles with streak, level, and experience points
- **journal_entries**: Health journal entries linked to users
- **health_metrics**: Health data related to journal entries

See `SUPABASE_SETUP.md` for detailed database setup instructions.

## Design System

Thryve follows a consistent design system with:

- Typography scale
- Color palette with semantic colors
- Spacing, border radius, and shadow systems
- Component style guidelines
- Icon standards


## Key Components

- **HealthTrends**: Visualizes health metrics over time
- **JournalEntryCard**: Displays individual journal entries with mood indicators
- **StreakCard**: Shows user's current streak and progress
- **HealthChallengeCard**: Displays available health challenges
- **AchievementCard**: Shows user achievements and progress

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Health tracking algorithms inspired by leading wellness applications
- Design system based on modern mobile UI/UX principles
- Icons provided by Lucide React Native and React Native Heroicons 