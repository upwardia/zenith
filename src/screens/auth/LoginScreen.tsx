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

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { login, isLoading } = useAuthStore();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      toast.show('Please fill in all fields', 'error');
      return;
    }
    
    try {
      await login(email);
      toast.show('Welcome back!', 'success');
    } catch (error) {
      toast.show('Login failed. Please try again.', 'error');
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

      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
        <Text className="text-gray-500 text-lg">Sign in to continue your journey</Text>
      </View>

      <View className="gap-4 mb-6">
        <Input
          label="Email or Phone"
          placeholder="Enter your email or phone"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <View>
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity className="self-end mt-2">
            <Text className="text-orange-500 font-medium">Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title="Sign In"
        onPress={handleLogin}
        isLoading={isLoading}
        variant="primary"
        className="mb-4"
      />

      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-500">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text className="text-orange-500 font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};
