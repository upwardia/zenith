import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { TrendingUp, Heart, Wallet, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Landing'>;

export const LandingScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={['#fff7ed', '#ffedd5']} // warm orange/yellow tint
        className="absolute top-0 left-0 right-0 h-full"
      />
      <ScreenWrapper scrollable safeArea contentContainerClassName="pb-10">
        <View className="items-center mt-10 mb-8">
          <View className="bg-orange-100 p-4 rounded-full mb-4">
            <TrendingUp size={40} color="#f97316" />
          </View>
          <Text className="text-4xl font-bold text-gray-900 mb-2">Upwardia</Text>
          <Text className="text-lg text-gray-600 text-center px-4">
            Build healthy habits, earn rewards, and protect your family’s future—all in one place
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between mb-8">
          <FeatureCard icon={<Heart color="#ef4444" />} title="Health Missions" />
          <FeatureCard icon={<Wallet color="#22c55e" />} title="Money Tips" />
          <FeatureCard icon={<TrendingUp color="#3b82f6" />} title="Mental Wellness" />
          <FeatureCard icon={<Shield color="#8b5cf6" />} title="Family Safety" />
        </View>

        <Card className="bg-orange-50 border-orange-100 mb-8 items-center p-6">
          <Text className="text-xl font-bold text-orange-800 mb-2">We pay you to build better habits</Text>
          <Text className="text-orange-700 text-center">
            Join thousands of members earning rewards for daily check-ins and missions.
          </Text>
        </Card>

        <View className="gap-4">
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Signup')}
            variant="primary"
            className="w-full"
          />
          <Button
            title="I Already Have an Account"
            onPress={() => navigation.navigate('Login')}
            variant="ghost"
            className="w-full"
          />
        </View>
      </ScreenWrapper>
    </View>
  );
};

const FeatureCard = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 items-center border border-gray-100">
    <View className="mb-2">{icon}</View>
    <Text className="font-semibold text-gray-800 text-center">{title}</Text>
  </View>
);
