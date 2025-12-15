import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { create } from 'zustand';
import { clsx } from 'clsx';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string | null;
  type: ToastType;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  show: (message, type = 'success') => set({ message, type }),
  hide: () => set({ message: null }),
}));

export const Toast: React.FC = () => {
  const { message, type, hide } = useToast();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (message) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => hide());
    }
  }, [message]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle size={20} color="white" />,
    error: <XCircle size={20} color="white" />,
    info: <AlertCircle size={20} color="white" />,
  };

  const bgColors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}
      className={clsx(
        "absolute top-12 left-4 right-4 p-4 rounded-xl flex-row items-center shadow-lg z-50",
        bgColors[type]
      )}
    >
      {icons[type]}
      <Text className="text-white font-medium ml-3 flex-1">{message}</Text>
    </Animated.View>
  );
};
