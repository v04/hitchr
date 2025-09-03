import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen = () => {
  const { userProfile, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const stats = [
    {
      label: 'Total Rides',
      value: userProfile?.totalRides || 0,
      icon: 'car-outline',
      color: '#6C63FF',
    },
    {
      label: 'Tokens Earned',
      value: userProfile?.tokens || 0,
      icon: 'diamond-outline',
      color: '#4ECDC4',
    },
    {
      label: 'CO₂ Saved',
      value: '45kg',
      icon: 'leaf-outline',
      color: '#4ECDC4',
    },
    {
      label: 'Rating',
      value: '4.9⭐',
      icon: 'star-outline',
      color: '#FFD93D',
    },
  ];

  const menuItems = [
    {
      id: 'prime',
      title: 'Upgrade to Prime',
      subtitle: '25% bonus tokens + cash payments',
      icon: 'diamond-outline',
      color: '#FFD700',
      showArrow: true,
      isPrime: true,
    },
    {
      id: 'rides',
      title: 'Ride History',
      subtitle: 'View all your past rides',
      icon: 'time-outline',
      color: '#6C63FF',
      showArrow: true,
    },
    {
      id: 'achievements',
      title: 'Achievements',
      subtitle: 'Unlock badges and earn rewards',
      icon: 'trophy-outline',
      color: '#FF6B6B',
      showArrow: true,
    },
    {
      id: 'referral',
      title: 'Refer Friends',
      subtitle: 'Earn 100 tokens for each referral',
      icon: 'people-outline',
      color: '#4ECDC4',
      showArrow: true,
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
      icon: 'help-circle-outline',
      color: '#6C63FF',
      showArrow: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      icon: 'settings-outline',
      color: '#666',
      showArrow: true,
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleMenuPress = (item) => {
    switch (item.id) {
      case 'prime':
        Alert.alert('Prime Upgrade', 'Prime subscription feature coming soon!');
        break;
      case 'rides':
        Alert.alert('Ride History', 'Ride history feature coming soon!');
        break;
      case 'achievements':
        Alert.alert('Achievements', 'Achievement system coming soon!');
        break;
      case 'referral':
        Alert.alert('Refer Friends', 'Referral program coming soon!');
        break;
      case 'support':
        Alert.alert('Support', 'Help & Support feature coming soon!');
        break;
      case 'settings':
        Alert.alert('Settings', 'Settings page coming soon!');
        break;
      default:
        break;
    }
  };

  const renderProfileHeader = () => (
    <Animatable.View animation="fadeInDown" delay={300}>
      <LinearGradient
        colors={['#6C63FF', '#4834D4']}
        style={styles.profileHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile?.firstName?.charAt(0)?.toUpperCase() || '👤'}
              </Text>
            </View>
            {userProfile?.isPrimeMember && (
              <View style={styles.primeBadge}>
                <Text style={styles.primeText}>⭐</Text>
              </View>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userProfile?.displayName || 'User'}
            </Text>
            <Text style={styles.profileEmail}>
              {userProfile?.email}
            </Text>
            {userProfile?.isPrimeMember && (
              <View style={styles.membershipBadge}>
                <Text style={styles.membershipText}>Prime Member</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderStats = () => (
    <Animatable.View animation="fadeInUp" delay={500}>
      <BlurView intensity={20} style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Journey</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </BlurView>
    </Animatable.View>
  );

  const renderMenuItem = (item, index) => (
    <Animatable.View key={item.id} animation="fadeInUp" delay={700 + index * 100}>
      <TouchableOpacity
        style={[
          styles.menuItem,
          item.isPrime && styles.primeMenuItem
        ]}
        onPress={() => handleMenuPress(item)}
      >
        {item.isPrime && (
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        <View style={styles.menuItemContent}>
          <View style={[
            styles.menuIcon,
            { backgroundColor: item.isPrime ? 'rgba(255,255,255,0.2)' : item.color + '20' }
          ]}>
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={item.isPrime ? '#FFFFFF' : item.color} 
            />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[
              styles.menuTitle,
              item.isPrime && { color: '#FFFFFF' }
            ]}>
              {item.title}
            </Text>
            <Text style={[
              styles.menuSubtitle,
              item.isPrime && { color: 'rgba(255,255,255,0.8)' }
            ]}>
              {item.subtitle}
            </Text>
          </View>
          {item.showArrow && (
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={item.isPrime ? '#FFFFFF' : '#999'} 
            />
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderSettingsSection = () => (
    <Animatable.View animation="fadeInUp" delay={1200}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={24} color="#6C63FF" />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E0E0E0', true: '#6C63FF' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="moon-outline" size={24} color="#6C63FF" />
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#E0E0E0', true: '#6C63FF' }}
            thumbColor={darkModeEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderProfileHeader()}
          {renderStats()}
          
          <View style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </View>
          
          {renderSettingsSection()}
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
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
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  primeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primeText: {
    fontSize: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  membershipBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  membershipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
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
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  primeMenuItem: {
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    elevation: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginLeft: 10,
  },
});

export default ProfileScreen;