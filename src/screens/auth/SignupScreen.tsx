import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../components/Toast';
import { ArrowLeft } from 'lucide-react-native';
import { clsx } from 'clsx';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

export const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signup, isLoading } = useAuthStore();
  const toast = useToast();

  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!identifier || !password || !confirmPassword) {
      toast.show('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 6) {
      toast.show('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      toast.show('Passwords do not match', 'error');
      return;
    }

    try {
      await signup(identifier);
      toast.show('Account created successfully!', 'success');
    } catch (error) {
      toast.show('Signup failed. Please try again.', 'error');
    }
  };

  return (
    <ScreenWrapper safeArea className="bg-white">
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        className="mb-6 w-10 h-10 items-center justify-center rounded-full bg-gray-50"
      >
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>

      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
        <Text className="text-gray-500 text-lg">Start your journey to better habits</Text>
      </View>

      <View className="flex-row bg-gray-100 p-1 rounded-xl mb-6">
        <TouchableOpacity 
          onPress={() => setMethod('email')}
          className={clsx("flex-1 py-2 rounded-lg items-center", method === 'email' ? "bg-white shadow-sm" : "")}
        >
          <Text className={clsx("font-medium", method === 'email' ? "text-gray-900" : "text-gray-500")}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setMethod('phone')}
          className={clsx("flex-1 py-2 rounded-lg items-center", method === 'phone' ? "bg-white shadow-sm" : "")}
        >
          <Text className={clsx("font-medium", method === 'phone' ? "text-gray-900" : "text-gray-500")}>Phone</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-4 mb-6">
        <Input
          label={method === 'email' ? "Email Address" : "Phone Number"}
          placeholder={method === 'email' ? "Enter your email" : "Enter your phone number"}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
        />
        <Input
          label="Password"
          placeholder="Create a password (min 6 chars)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <Button
        title="Create Account"
        onPress={handleSignup}
        isLoading={isLoading}
        variant="primary"
        className="mb-4"
      />

      <Text className="text-xs text-gray-400 text-center px-4">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </ScreenWrapper>
  );
};
