import React from 'react';
import { View, Text } from 'react-native';

const Placeholder = ({ name }: { name: string }) => (
  <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-xl font-bold">{name}</Text>
  </View>
);

export const LandingScreen = () => <Placeholder name="Landing Screen" />;
export const LoginScreen = () => <Placeholder name="Login Screen" />;
export const SignupScreen = () => <Placeholder name="Signup Screen" />;
export const TodayScreen = () => <Placeholder name="Today Screen" />;
export const MissionsScreen = () => <Placeholder name="Missions Screen" />;
export const WalletScreen = () => <Placeholder name="Wallet Screen" />;
export const ProgressScreen = () => <Placeholder name="Progress Screen" />;
export const ProfileScreen = () => <Placeholder name="Profile Screen" />;
