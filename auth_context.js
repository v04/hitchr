import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth, db } from '../config/firebase.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up new user
  const signup = async (email, password, userData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        ...userData,
        tokens: 50, // Welcome bonus
        totalRides: 0,
        isPrimeMember: false,
        createdAt: new Date(),
        achievements: [],
        badges: ['rookie']
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      setUserProfile(userDoc);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign in existing user
  const signin = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Sign out user
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user');
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profile = userDoc.data();
        setUserProfile(profile);
        await AsyncStorage.setItem('user', JSON.stringify(profile));
        return profile;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Update user tokens
  const updateUserTokens = async (tokensToAdd) => {
    if (!currentUser || !userProfile) return;

    try {
      const newTokenCount = userProfile.tokens + tokensToAdd;
      const userRef = doc(db, 'users', currentUser.uid);
      
      await setDoc(userRef, { tokens: newTokenCount }, { merge: true });
      
      const updatedProfile = { ...userProfile, tokens: newTokenCount };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('user', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating tokens:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user.uid);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Load cached user data on app start
    const loadCachedUser = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem('user');
        if (cachedUser && !userProfile) {
          setUserProfile(JSON.parse(cachedUser));
        }
      } catch (error) {
        console.error('Error loading cached user:', error);
      }
    };

    loadCachedUser();

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    signin,
    logout,
    updateUserTokens,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};