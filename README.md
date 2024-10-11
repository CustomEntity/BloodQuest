# BloodQuest

BloodQuest is an innovative mobile application that transforms blood donation into an engaging and gamified experience. Developed with React Native and Expo, this app aims to motivate blood donors through a system of quests, rewards, and progression.

## Key Features

- Personalized quest system
- Progression and levels
- Rewards and badges
- Rankings and competitions
- Gamified notifications and reminders
- Social sharing and referral system
- Donation tracking and history
- Health integration

## Prerequisites

- Node.js (version 14 or higher)
- yarn (preferred) or npm
- Expo CLI
- An Expo account
- iOS/Android emulator or physical device for testing

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-organization/bloodquest.git
   cd bloodquest
   ```

2. Install dependencies:
   ```
   yarn install
   # or
   npm install
   ```

3. Start the application:
   ```
   yarn start
   # or
   npm start
   ```

## Project Structure

The project uses Expo Router for file-based routing. Here's the current structure:

```
bloodquest/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── appointment/
│   │   │   └── [id].tsx
│   │   ├── appointment-selection/
│   │   │   └── [id].tsx
│   │   ├── campaign/
│   │   │   └── [id].tsx
│   │   ├── donate.tsx
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   ├── quests.tsx
│   │   └── ranking.tsx
│   ├── _layout.tsx
│   ├── core/
│   │   ├── constants.ts
│   │   └── query.ts
│   └── sign-in.tsx
├── assets/
├── components/
├── constants/
├── hooks/
├── utils/
├── app.json
├── babel.config.js
├── codegen.yml
├── ctx.tsx
├── eas.json
├── expo-env.d.ts
├── package.json
├── tsconfig.json
└── yarn.lock
```

## Configuration

1. Configure your `app.json` file with your app-specific information.
2. If necessary, update environment variables in a `.env` file (make sure not to commit this file).

## Deployment

1. Build the app for production using EAS Build:
   ```
   eas build --platform ios
   # or
   eas build --platform android
   ```

2. Submit your app to the stores using EAS Submit:
   ```
   eas submit --platform ios
   # or
   eas submit --platform android
   ```

## Contributing

Contributions are welcome! Please refer to the CONTRIBUTING.md file for contribution guidelines.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or suggestions, please contact the development team at dev@bloodquest.fr.