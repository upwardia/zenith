import React from 'react';
import { View, ViewProps } from 'react-native';
import { clsx } from 'clsx';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const baseStyles = "bg-white rounded-2xl p-4";
  const variantStyles = {
    default: "",
    elevated: "shadow-sm border border-gray-100",
    outlined: "border border-gray-200",
  };

  return (
    <View className={clsx(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </View>
  );
};
