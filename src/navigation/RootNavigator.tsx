import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { useAuthStore } from '../store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
