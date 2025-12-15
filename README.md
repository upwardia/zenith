# Upwardia

Upwardia is a React Native (Expo) app designed to help users build healthy habits, earn rewards, and protect their family's future.

## Features

- **Daily Dashboard**: Track your daily progress, streak, and points.
- **Missions**: Complete health, money, and mind missions to earn points.
- **Wallet**: View your balance, transaction history, and redeem rewards.
- **Progress**: Track milestones and unlock achievements.
- **Profile**: Manage your account and view stats.

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand (Auth), TanStack Query (Server State)
- **Styling**: NativeWind (Tailwind CSS)
- **Persistence**: AsyncStorage
- **Icons**: Lucide React Native

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the App**:
    ```bash
    npx expo start
    ```

3.  **Run on Device/Simulator**:
    -   Press `a` for Android Emulator.
    -   Press `i` for iOS Simulator (macOS only).
    -   Scan the QR code with the Expo Go app on your physical device.

## Project Structure

-   `src/api`: Mock API implementation.
-   `src/components`: Reusable UI components.
-   `src/navigation`: Navigation stacks and tabs.
-   `src/screens`: Screen components (Auth, Main).
-   `src/store`: Zustand stores.
-   `src/types`: TypeScript interfaces.
