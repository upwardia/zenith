import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text } from 'react-native';

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-blue-600">Upwardia Setup Complete!</Text>
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
