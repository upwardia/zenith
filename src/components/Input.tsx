import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { clsx } from 'clsx';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName,
  className,
  ...props
}) => {
  return (
    <View className={clsx("w-full", containerClassName)}>
      {label && <Text className="text-gray-700 font-medium mb-1.5">{label}</Text>}
      <TextInput
        className={clsx(
          "w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900",
          error && "border-red-500",
          className
        )}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};
