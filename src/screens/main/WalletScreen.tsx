import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MockAPI } from '../../api/mock';
import { useToast } from '../../components/Toast';
import { LinearGradient } from 'expo-linear-gradient';
import { clsx } from 'clsx';
import { Transaction, Reward } from '../../types';
import { Coffee, ShoppingBag, Star, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

export const WalletScreen = () => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'redeem'>('transactions');
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: MockAPI.getUser,
  });

  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: MockAPI.getTransactions,
  });

  const { data: rewards, refetch: refetchRewards } = useQuery({
    queryKey: ['rewards'],
    queryFn: MockAPI.getRewards,
  });

  const redeemMutation = useMutation({
    mutationFn: MockAPI.redeemReward,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.show('Reward redeemed successfully!', 'success');
    },
    onError: (error: Error) => {
      toast.show(error.message || 'Failed to redeem reward', 'error');
    },
  });

  const onRefresh = async () => {
    await Promise.all([refetchUser(), refetchTransactions(), refetchRewards()]);
  };

  return (
    <ScreenWrapper safeArea className="bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-1">Wallet</Text>
          <Text className="text-gray-500">Your points and rewards</Text>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#f97316', '#ea580c']}
          className="rounded-2xl p-6 mb-6 shadow-md"
        >
          <Text className="text-orange-100 font-medium mb-1">Total Balance</Text>
          <Text className="text-4xl font-bold text-white mb-2">{user?.totalPoints.toLocaleString()}</Text>
          <View className="bg-white/20 self-start px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-medium">+150 points this week</Text>
          </View>
        </LinearGradient>

        {/* Segmented Control */}
        <View className="flex-row bg-gray-200 p-1 rounded-xl mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('transactions')}
            className={clsx(
              "flex-1 py-2 items-center rounded-lg",
              activeTab === 'transactions' ? "bg-white shadow-sm" : ""
            )}
          >
            <Text className={clsx("font-medium", activeTab === 'transactions' ? "text-gray-900" : "text-gray-500")}>
              Transactions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('redeem')}
            className={clsx(
              "flex-1 py-2 items-center rounded-lg",
              activeTab === 'redeem' ? "bg-white shadow-sm" : ""
            )}
          >
            <Text className={clsx("font-medium", activeTab === 'redeem' ? "text-gray-900" : "text-gray-500")}>
              Redeem Rewards
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="gap-4 pb-20">
          {activeTab === 'transactions' ? (
            transactions?.map((t) => <TransactionItem key={t.id} transaction={t} />)
          ) : (
            rewards?.map((r) => (
              <RewardItem 
                key={r.id} 
                reward={r} 
                userPoints={user?.totalPoints || 0}
                onRedeem={() => redeemMutation.mutate(r.id)}
                isRedeeming={redeemMutation.isPending && redeemMutation.variables === r.id}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isPositive = transaction.delta > 0;
  return (
    <Card className="flex-row items-center p-4">
      <View className={clsx("w-10 h-10 rounded-full items-center justify-center mr-3", isPositive ? "bg-green-100" : "bg-gray-100")}>
        {isPositive ? <ArrowDownLeft size={20} color="#16a34a" /> : <ArrowUpRight size={20} color="#6b7280" />}
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-900">{transaction.title}</Text>
        <Text className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</Text>
      </View>
      <Text className={clsx("font-bold", isPositive ? "text-green-600" : "text-gray-600")}>
        {isPositive ? '+' : ''}{transaction.delta}
      </Text>
    </Card>
  );
};

const RewardItem = ({ reward, userPoints, onRedeem, isRedeeming }: { reward: Reward, userPoints: number, onRedeem: () => void, isRedeeming: boolean }) => {
  const canAfford = userPoints >= reward.costPoints;
  
  const getIcon = () => {
    if (reward.vendor === 'Starbucks') return <Coffee size={20} color="#00704A" />;
    if (reward.vendor === 'Amazon') return <ShoppingBag size={20} color="#FF9900" />;
    return <Star size={20} color="#f97316" />;
  };

  return (
    <Card className="flex-row items-center p-4">
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-3">
        {getIcon()}
      </View>
      <View className="flex-1 mr-2">
        <Text className="font-bold text-gray-900">{reward.title}</Text>
        <Text className="text-xs text-gray-500">{reward.vendor}</Text>
        <Text className="text-sm font-bold text-orange-500 mt-1">{reward.costPoints} pts</Text>
      </View>
      <Button
        title="Redeem"
        onPress={onRedeem}
        isLoading={isRedeeming}
        disabled={!canAfford}
        variant={canAfford ? 'primary' : 'ghost'}
        className={clsx("h-9 px-4 rounded-lg", !canAfford && "bg-gray-100")}
      />
    </Card>
  );
};
