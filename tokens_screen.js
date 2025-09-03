import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

const TokensScreen = () => {
  const { userProfile, updateUserTokens } = useAuth();
  const [selectedTab, setSelectedTab] = useState('rewards');

  const rewards = [
    {
      id: 1,
      brand: 'Zomato',
      title: '₹100 off on orders',
      tokens: 200,
      icon: '🍕',
      color: '#E23744',
      description: 'Valid on orders above ₹300',
    },
    {
      id: 2,
      brand: 'BookMyShow',
      title: '₹150 off on movies',
      tokens: 300,
      icon: '🎬',
      color: '#C4242D',
      description: 'Valid on weekend bookings',
    },
    {
      id: 3,
      brand: 'Amazon',
      title: '₹200 off on shopping',
      tokens: 400,
      icon: '📦',
      color: '#FF9900',
      description: 'Valid on electronics',
    },
    {
      id: 4,
      brand: 'Swiggy',
      title: '₹75 off on food',
      tokens: 150,
      icon: '🍔',
      color: '#FC8019',
      description: 'Valid on orders above ₹250',
    },
    {
      id: 5,
      brand: 'Myntra',
      title: '₹300 off on fashion',
      tokens: 500,
      icon: '👕',
      color: '#FF3F6C',
      description: 'Valid on orders above ₹999',
    },
    {
      id: 6,
      brand: 'Uber',
      title: '₹100 off on rides',
      tokens: 250,
      icon: '🚗',
      color: '#000000',
      description: 'Valid for next 3 rides',
    },
  ];

  const achievements = [
    {
      id: 1,
      title: 'First Journey',
      description: 'Complete your first ride',
      tokens: 50,
      completed: true,
      icon: '🚀',
    },
    {
      id: 2,
      title: 'Eco Champion',
      description: 'Save 100kg CO₂',
      tokens: 200,
      completed: false,
      progress: 65,
      icon: '🌱',
    },
    {
      id: 3,
      title: 'Route Explorer',
      description: 'Try 25 different routes',
      tokens: 300,
      completed: false,
      progress: 12,
      icon: '🗺️',
    },
    {
      id: 4,
      title: 'Social Butterfly',
      description: 'Get 100 story likes',
      tokens: 150,
      completed: false,
      progress: 34,
      icon: '🦋',
    },
  ];

  const tokenHistory = [
    { id: 1, type: 'earned', amount: 40, source: 'Ride completed', time: '2 hours ago' },
    { id: 2, type: 'earned', amount: 25, source: 'Bonus tokens', time: '1 day ago' },
    { id: 3, type: 'redeemed', amount: -200, source: 'Zomato voucher', time: '2 days ago' },
    { id: 4, type: 'earned', amount: 60, source: 'Ride completed', time: '3 days ago' },
    { id: 5, type: 'earned', amount: 50, source: 'Achievement unlocked', time: '1 week ago' },
  ];

  const handleRedemption = (reward) => {
    if (userProfile?.tokens >= reward.tokens) {
      Alert.alert(
        'Redeem Reward',
        `Redeem ${reward.title} for ${reward.tokens} tokens?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Redeem',
            onPress: () => {
              updateUserTokens(-reward.tokens);
              Alert.alert('Success!', 'Reward redeemed successfully! Check your email for the voucher code.');
            },
          },
        ]
      );
    } else {
      Alert.alert('Insufficient Tokens', `You need ${reward.tokens - userProfile?.tokens} more tokens to redeem this reward.`);
    }
  };

  const renderTokenBalance = () => (
    <Animatable.View animation="fadeInDown" delay={300}>
      <LinearGradient
        colors={['#6C63FF', '#4834D4']}
        style={styles.balanceCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.balanceContent}>
          <View style={styles.tokenInfo}>
            <Text style={styles.balanceLabel}>Your Tokens</Text>
            <Text style={styles.balanceAmount}>{userProfile?.tokens || 0}</Text>
            <Text style={styles.balanceSubtext}>Keep riding to earn more! 🚀</Text>
          </View>
          <View style={styles.tokenIcon}>
            <Text style={styles.tokenEmoji}>💎</Text>
          </View>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'rewards' && styles.activeTab]}
        onPress={() => setSelectedTab('rewards')}
      >
        <Text style={[styles.tabText, selectedTab === 'rewards' && styles.activeTabText]}>
          Rewards
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'achievements' && styles.activeTab]}
        onPress={() => setSelectedTab('achievements')}
      >
        <Text style={[styles.tabText, selectedTab === 'achievements' && styles.activeTabText]}>
          Achievements
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'history' && styles.activeTab]}
        onPress={() => setSelectedTab('history')}
      >
        <Text style={[styles.tabText, selectedTab === 'history' && styles.activeTabText]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRewards = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Redeem Your Tokens</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {rewards.map((reward, index) => (
          <Animatable.View
            key={reward.id}
            animation="fadeInUp"
            delay={index * 100}
          >
            <BlurView intensity={20} style={styles.rewardCard}>
              <View style={styles.rewardContent}>
                <View style={[styles.brandIcon, { backgroundColor: reward.color + '20' }]}>
                  <Text style={styles.rewardIcon}>{reward.icon}</Text>
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.brandName}>{reward.brand}</Text>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>
                </View>
                <View style={styles.rewardAction}>
                  <Text style={styles.tokenCost}>{reward.tokens} 💎</Text>
                  <TouchableOpacity
                    style={[
                      styles.redeemButton,
                      { backgroundColor: userProfile?.tokens >= reward.tokens ? reward.color : '#E0E0E0' }
                    ]}
                    onPress={() => handleRedemption(reward)}
                    disabled={userProfile?.tokens < reward.tokens}
                  >
                    <Text style={styles.redeemButtonText}>
                      {userProfile?.tokens >= reward.tokens ? 'Redeem' : 'Need More'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Unlock Achievements</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {achievements.map((achievement, index) => (
          <Animatable.View
            key={achievement.id}
            animation="fadeInUp"
            delay={index * 100}
          >
            <BlurView intensity={20} style={styles.achievementCard}>
              <View style={styles.achievementContent}>
                <View style={styles.achievementIconContainer}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  {achievement.completed && (
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  {!achievement.completed && achievement.progress && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            { width: `${achievement.progress}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{achievement.progress}%</Text>
                    </View>
                  )}
                </View>
                <View style={styles.achievementReward}>
                  <Text style={styles.achievementTokens}>+{achievement.tokens}</Text>
                  <Text style={styles.achievementTokenLabel}>tokens</Text>
                </View>
              </View>
            </BlurView>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Token History</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {tokenHistory.map((item, index) => (
          <Animatable.View
            key={item.id}
            animation="fadeInUp"
            delay={index * 100}
          >
            <View style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Ionicons
                  name={item.type === 'earned' ? 'add-circle' : 'remove-circle'}
                  size={24}
                  color={item.type === 'earned' ? '#4ECDC4' : '#FF6B6B'}
                />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historySource}>{item.source}</Text>
                <Text style={styles.historyTime}>{item.time}</Text>
              </View>
              <Text style={[
                styles.historyAmount,
                { color: item.type === 'earned' ? '#4ECDC4' : '#FF6B6B' }
              ]}>
                {item.type === 'earned' ? '+' : ''}{item.amount}
              </Text>
            </View>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'rewards':
        return renderRewards();
      case 'achievements':
        return renderAchievements();
      case 'history':
        return renderHistory();
      default:
        return renderRewards();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={styles.gradient}
      >
        {renderTokenBalance()}
        {renderTabs()}
        {renderContent()}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  balanceCard: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenInfo: {
    flex: 1,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 5,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balanceSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
  },
  tokenIcon: {
    alignItems: 'center',
  },
  tokenEmoji: {
    fontSize: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6C63FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  rewardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  rewardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  brandIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rewardTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rewardDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  rewardAction: {
    alignItems: 'center',
  },
  tokenCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  redeemButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  achievementContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  achievementIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  achievementIcon: {
    fontSize: 40,
  },
  completedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  achievementReward: {
    alignItems: 'center',
  },
  achievementTokens: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  achievementTokenLabel: {
    fontSize: 12,
    color: '#666',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyIcon: {
    marginRight: 15,
  },
  historyInfo: {
    flex: 1,
  },
  historySource: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TokensScreen;