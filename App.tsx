import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Toast } from './src/components/Toast';
import './global.css'; // Ensure tailwind is loaded if needed, though babel handles it usually.

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator />
        <Toast />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
