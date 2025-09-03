import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { userProfile, currentUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [quickStats, setQuickStats] = useState({
    todayRides: 2,
    weeklyTokens: 150,
    streak: 5,
    nextReward: 'Zomato ₹100 off',
  });

  const vehicleTypes = [
    {
      id: 'car',
      name: 'Car',
      icon: 'car-outline',
      rate: '₹25/km',
      tokens: '20 tokens/km',
      color: '#6C63FF',
    },
    {
      id: 'auto',
      name: 'Auto',
      icon: 'bus-outline',
      rate: '₹15/km',
      tokens: '20 tokens/km',
      color: '#FF6B6B',
    },
    {
      id: 'bike',
      name: 'Bike',
      icon: 'bicycle-outline',
      rate: '₹8/km',
      tokens: '20 tokens/km',
      color: '#4ECDC4',
    },
  ];

  const quickActions = [
    {
      id: 'book-ride',
      title: 'Book Ride',
      icon: 'car-outline',
      color: '#6C63FF',
      screen: 'Map',
    },
    {
      id: 'pilot-mode',
      title: 'Pilot Mode',
      icon: 'navigate-outline',
      color: '#FF6B6B',
      screen: 'Map',
    },
    {
      id: 'rewards',
      title: 'Rewards',
      icon: 'gift-outline',
      color: '#4ECDC4',
      screen: 'Tokens',
    },
    {
      id: 'community',
      title: 'Community',
      icon: 'people-outline',
      color: '#FFD93D',
      screen: 'Social',
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderWelcomeCard = () => (
    <Animatable.View animation="fadeInDown" delay={300}>
      <LinearGradient
        colors={['#6C63FF', '#4834D4']}
        style={styles.welcomeCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.welcomeContent}>
          <View>
            <Text style={styles.welcomeGreeting}>
              Good {getGreeting()}, {userProfile?.firstName}! 👋
            </Text>
            <Text style={styles.welcomeText}>Ready to earn tokens today?</Text>
          </View>
          <View style={styles.tokenBadge}>
            <Text style={styles.tokenCount}>{userProfile?.tokens || 0}</Text>
            <Text style={styles.tokenLabel}>Tokens</Text>
          </View>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderQuickStats = () => (
    <Animatable.View animation="fadeInUp" delay={500}>
      <View style={styles.quickStatsContainer}>
        <BlurView intensity={20} style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{quickStats.todayRides}</Text>
              <Text style={styles.statLabel}>Today's Rides</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{quickStats.weeklyTokens}</Text>
              <Text style={styles.statLabel}>Weekly Tokens</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{quickStats.streak} 🔥</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </BlurView>
      </View>
    </Animatable.View>
  );

  const renderVehicleTypes = () => (
    <Animatable.View animation="fadeInLeft" delay={700}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Choose Your Ride</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehicleScrollContainer}
        >
          {vehicleTypes.map((vehicle, index) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[styles.vehicleCard, { borderColor: vehicle.color }]}
              onPress={() => navigation.navigate('Map', { vehicleType: vehicle.id })}
            >
              <View style={[styles.vehicleIcon, { backgroundColor: vehicle.color }]}>
                <Ionicons name={vehicle.icon} size={30} color="#FFFFFF" />
              </View>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleRate}>{vehicle.rate}</Text>
              <Text style={styles.vehicleTokens}>{vehicle.tokens}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Animatable.View>
  );

  const renderQuickActions = () => (
    <Animatable.View animation="fadeInRight" delay={900}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: action.color + '15' }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animatable.View>
  );

  const renderPrimePromo = () => (
    <Animatable.View animation="fadeInUp" delay={1100}>
      <TouchableOpacity style={styles.primePromo}>
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.primeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.primeContent}>
            <View>
              <Text style={styles.primeTitle}>Upgrade to Prime ⭐</Text>
              <Text style={styles.primeSubtitle}>
                Cash payments • Priority matching • 25% bonus tokens
              </Text>
            </View>
            <View style={styles.primePrice}>
              <Text style={styles.priceCurrency}>₹</Text>
              <Text style={styles.priceAmount}>99</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderWelcomeCard()}
          {renderQuickStats()}
          {renderVehicleTypes()}
          {renderQuickActions()}
          {!userProfile?.isPrimeMember && renderPrimePromo()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeGreeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  tokenBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tokenCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tokenLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  quickStatsContainer: {
    marginBottom: 25,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  vehicleScrollContainer: {
    paddingHorizontal: 5,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 2,
    width: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  vehicleRate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  vehicleTokens: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 55) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  primePromo: {
    marginBottom: 30,
  },
  primeGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  primeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  primeSubtitle: {
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
    paddingRight: 10,
  },
  primePrice: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  priceCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default HomeScreen;
          