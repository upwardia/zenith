import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TodayScreen, MissionsScreen, WalletScreen, ProgressScreen, ProfileScreen } from '../screens/placeholders';
import { LayoutDashboard, Target, Wallet, TrendingUp, User } from 'lucide-react-native';

export type AppTabsParamList = {
  Today: undefined;
  Missions: undefined;
  Wallet: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

export const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f97316', // Orange-500
        tabBarInactiveTintColor: '#9ca3af', // Gray-400
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Missions"
        component={MissionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
