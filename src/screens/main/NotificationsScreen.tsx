import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useToast } from '../../components/Toast';
import { MockAPI } from '../../api/mock';

export const NotificationsScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [promoEnabled, setPromoEnabled] = useState(true);

  const handleSave = async () => {
      await MockAPI.updateNotificationSettings({ pushEnabled, emailEnabled, promoEnabled });
      toast.show('Settings saved', 'success');
      navigation.goBack();
  };

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-1">Notifications</Text>
        <Text className="text-gray-500">Control how we contact you</Text>
      </View>

      <Card className="mb-6 p-0 overflow-hidden">
        <View className="p-4 flex-row justify-between items-center border-b border-gray-100">
            <View className="flex-1 pr-4">
                <Text className="font-bold text-gray-900 text-base">Push Notifications</Text>
                <Text className="text-gray-500 text-sm">Receive daily reminders and mission updates</Text>
            </View>
            <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#e5e7eb', true: '#fb923c' }}
                thumbColor={pushEnabled ? '#fff' : '#fff'}
            />
        </View>

        <View className="p-4 flex-row justify-between items-center border-b border-gray-100">
            <View className="flex-1 pr-4">
                <Text className="font-bold text-gray-900 text-base">Email Updates</Text>
                <Text className="text-gray-500 text-sm">Weekly summaries and progress reports</Text>
            </View>
            <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: '#e5e7eb', true: '#fb923c' }}
                thumbColor={emailEnabled ? '#fff' : '#fff'}
            />
        </View>

        <View className="p-4 flex-row justify-between items-center">
            <View className="flex-1 pr-4">
                <Text className="font-bold text-gray-900 text-base">Promotions</Text>
                <Text className="text-gray-500 text-sm">Special offers and partner rewards</Text>
            </View>
            <Switch
                value={promoEnabled}
                onValueChange={setPromoEnabled}
                trackColor={{ false: '#e5e7eb', true: '#fb923c' }}
                thumbColor={promoEnabled ? '#fff' : '#fff'}
            />
        </View>
      </Card>

      <Button
        title="Save Settings"
        onPress={handleSave}
        className="rounded-xl"
      />
      <Button
        title="Cancel"
        variant="ghost"
        onPress={() => navigation.goBack()}
        className="mt-2"
      />
    </ScreenWrapper>
  );
};
