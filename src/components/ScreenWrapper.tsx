import React from 'react';
import { View, ScrollView, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clsx } from 'clsx';

interface ScreenWrapperProps extends ViewProps {
  scrollable?: boolean;
  safeArea?: boolean;
  contentContainerClassName?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  className,
  scrollable = false,
  safeArea = true,
  contentContainerClassName,
  ...props
}) => {
  const Container = safeArea ? SafeAreaView : View;

  if (scrollable) {
    return (
      <Container className={clsx("flex-1 bg-gray-50", className)} {...props}>
        <ScrollView
          contentContainerClassName={clsx("p-4", contentContainerClassName)}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Container>
    );
  }

  return (
    <Container className={clsx("flex-1 bg-gray-50 p-4", className)} {...props}>
      {children}
    </Container>
  );
};
