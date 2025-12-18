import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { useAuthStore } from '../store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';
import { ProfileEditScreen } from '../screens/main/ProfileEditScreen';
import { HouseholdScreen } from '../screens/main/HouseholdScreen';
import { NotificationsScreen } from '../screens/main/NotificationsScreen';
import { SupportScreen } from '../screens/main/SupportScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, login } = useAuthStore();

  // For MVP, we might want to check persistence on load, but zustand persist handles it.
  // However, we need to wait for hydration.
  // Zustand persist middleware handles hydration automatically, but we might see a flash.
  // For now, we'll trust the state.

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="App" component={AppTabs} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
            <Stack.Screen name="Household" component={HouseholdScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Support" component={SupportScreen} />
          </Stack.Group>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
  );
};
