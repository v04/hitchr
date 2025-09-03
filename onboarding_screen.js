import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6C63FF', '#4834D4', '#686DE0']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <Animatable.View
            animation="fadeInDown"
            delay={500}
            style={styles.logoSection}
          >
            <Text style={styles.logoEmoji}>🚗✨</Text>
            <Text style={styles.appName}>Hitchr</Text>
            <Text style={styles.tagline}>Ride • Earn • Connect</Text>
          </Animatable.View>

          {/* Features Section */}
          <Animatable.View
            animation="fadeInUp"
            delay={1000}
            style={styles.featuresSection}
          >
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>💰</Text>
              <Text style={styles.featureTitle}>Earn Tokens</Text>
              <Text style={styles.featureText}>20 tokens per km on every ride</Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🏆</Text>
              <Text style={styles.featureTitle}>Unlock Rewards</Text>
              <Text style={styles.featureText}>Redeem for Zomato, BookMyShow & more</Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>👥</Text>
              <Text style={styles.featureTitle}>Join Community</Text>
              <Text style={styles.featureText}>Share stories & connect with riders</Text>
            </View>
          </Animatable.View>

          {/* Action Buttons */}
          <Animatable.View
            animation="fadeInUp"
            delay={1500}
            style={styles.buttonSection}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Already have an account?</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 50,
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '300',
  },
  featuresSection: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 30,
  },
  featureItem: {
    alignItems: 'center',
    marginBottom: 40,
  },
  featureEmoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonSection: {
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 15,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;