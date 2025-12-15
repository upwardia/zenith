import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { clsx } from 'clsx';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className,
}) => {
  const baseStyles = "h-12 rounded-xl flex-row items-center justify-center px-4";
  const variantStyles = {
    primary: "bg-orange-500",
    secondary: "bg-blue-600",
    outline: "border-2 border-orange-500 bg-transparent",
    ghost: "bg-transparent",
  };
  const textStyles = {
    primary: "text-white font-bold text-base",
    secondary: "text-white font-bold text-base",
    outline: "text-orange-500 font-bold text-base",
    ghost: "text-gray-600 font-medium text-base",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        (disabled || isLoading) && "opacity-50",
        className
      )}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#f97316' : 'white'} />
      ) : (
        <Text className={clsx(textStyles[variant])}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
