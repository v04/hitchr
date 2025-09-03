import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const SocialScreen = () => {
  const [selectedTab, setSelectedTab] = useState('feed');

  const stories = [
    {
      id: 1,
      user: 'You',
      avatar: '👤',
      hasStory: false,
      isAdd: true,
    },
    {
      id: 2,
      user: 'Priya',
      avatar: '👩',
      hasStory: true,
      viewed: false,
    },
    {
      id: 3,
      user: 'Rajesh',
      avatar: '👨',
      hasStory: true,
      viewed: true,
    },
    {
      id: 4,
      user: 'Anjali',
      avatar: '👩‍💼',
      hasStory: true,
      viewed: false,
    },
  ];

  const feedPosts = [
    {
      id: 1,
      user: 'Priya Sharma',
      avatar: '👩',
      time: '2h ago',
      route: 'Hitech City → Gachibowli',
      tokens: 45,
      likes: 23,
      comments: 8,
      isLiked: false,
      content: 'Amazing ride with great conversation! Met a fellow tech enthusiast 🚗✨',
      image: null,
    },
    {
      id: 2,
      user: 'Rajesh Kumar',
      avatar: '👨',
      time: '4h ago',
      route: 'Begumpet → Ameerpet',
      tokens: 30,
      likes: 18,
      comments: 5,
      isLiked: true,
      content: 'Traffic was smooth today! Perfect weather for a bike ride 🏍️',
      image: null,
    },
    {
      id: 3,
      user: 'Anjali Reddy',
      avatar: '👩‍💼',
      time: '1d ago',
      route: 'Secunderabad → Jubilee Hills',
      tokens: 60,
      likes: 42,
      comments: 12,
      isLiked: false,
      content: 'Crossed 1000 tokens milestone! 🎉 Thanks to all my co-riders for making every journey special!',
      image: null,
    },
  ];

  const communities = [
    {
      id: 1,
      name: 'Hyderabad Commuters',
      members: '12.5K',
      posts: '250 today',
      icon: '🏙️',
      color: '#6C63FF',
      isMember: true,
    },
    {
      id: 2,
      name: 'IT Corridor Riders',
      members: '8.3K',
      posts: '180 today',
      icon: '💻',
      color: '#4ECDC4',
      isMember: true,
    },
    {
      id: 3,
      name: 'Weekend Warriors',
      members: '5.7K',
      posts: '95 today',
      icon: '🌄',
      color: '#FF6B6B',
      isMember: false,
    },
    {
      id: 4,
      name: 'Eco Travelers',
      members: '3.2K',
      posts: '60 today',
      icon: '🌱',
      color: '#FFD93D',
      isMember: false,
    },
  ];

  const renderStories = () => (
    <View style={styles.storiesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <View style={[
              styles.storyAvatar,
              story.isAdd && styles.addStoryAvatar,
              story.hasStory && !story.viewed && styles.unviewedStory,
              story.hasStory && story.viewed && styles.viewedStory,
            ]}>
              <Text style={styles.storyAvatarText}>{story.avatar}</Text>
              {story.isAdd && (
                <View style={styles.addIcon}>
                  <Ionicons name="add" size={12} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={styles.storyUsername}>{story.user}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'feed' && styles.activeTab]}
        onPress={() => setSelectedTab('feed')}
      >
        <Text style={[styles.tabText, selectedTab === 'feed' && styles.activeTabText]}>
          Feed
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'communities' && styles.activeTab]}
        onPress={() => setSelectedTab('communities')}
      >
        <Text style={[styles.tabText, selectedTab === 'communities' && styles.activeTabText]}>
          Communities
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFeedPost = (post, index) => (
    <Animatable.View key={post.id} animation="fadeInUp" delay={index * 100}>
      <BlurView intensity={20} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.postUserInfo}>
            <View style={styles.postAvatar}>
              <Text style={styles.postAvatarText}>{post.avatar}</Text>
            </View>
            <View style={styles.postUserDetails}>
              <Text style={styles.postUsername}>{post.user}</Text>
              <View style={styles.postMeta}>
                <Text style={styles.postRoute}>{post.route}</Text>
                <Text style={styles.postTime}>• {post.time}</Text>
              </View>
            </View>
          </View>
          <View style={styles.tokensBadge}>
            <Text style={styles.tokensText}>+{post.tokens} 💎</Text>
          </View>
        </View>

        <Text style={styles.postContent}>{post.content}</Text>

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={24}
              color={post.isLiked ? "#FF6B6B" : "#666"}
            />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animatable.View>
  );

  const renderFeed = () => (
    <ScrollView style={styles.feedContainer} showsVerticalScrollIndicator={false}>
      {renderStories()}
      {feedPosts.map(renderFeedPost)}
    </ScrollView>
  );

  const renderCommunityCard = (community, index) => (
    <Animatable.View key={community.id} animation="fadeInUp" delay={index * 100}>
      <BlurView intensity={20} style={styles.communityCard}>
        <View style={styles.communityContent}>
          <View style={[styles.communityIcon, { backgroundColor: community.color + '20' }]}>
            <Text style={styles.communityIconText}>{community.icon}</Text>
          </View>
          <View style={styles.communityInfo}>
            <Text style={styles.communityName}>{community.name}</Text>
            <Text style={styles.communityStats}>{community.members} members • {community.posts}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.joinButton,
              community.isMember ? styles.joinedButton : { backgroundColor: community.color }
            ]}
          >
            <Text style={[
              styles.joinButtonText,
              community.isMember && { color: community.color }
            ]}>
              {community.isMember ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animatable.View>
  );

  const renderCommunities = () => (
    <ScrollView style={styles.communitiesContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Discover Communities</Text>
      {communities.map(renderCommunityCard)}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8F9FA', '#E9ECEF']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Social</Text>
          <TouchableOpacity style={styles.createPostButton}>
            <Ionicons name="add" size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {renderTabs()}
        
        {selectedTab === 'feed' ? renderFeed() : renderCommunities()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  createPostButton: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  feedContainer: {
    flex: 1,
  },
  storiesContainer: {
    paddingVertical: 15,
    paddingLeft: 20,
    marginBottom: 10,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginBottom: 5,
    position: 'relative',
  },
  addStoryAvatar: {
    borderWidth: 2,
    borderColor: '#6C63FF',
    borderStyle: 'dashed',
  },
  unviewedStory: {
    borderWidth: 3,
    borderColor: '#6C63FF',
  },
  viewedStory: {
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  storyAvatarText: {
    fontSize: 24,
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6C63FF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyUsername: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    fontSize: 20,
  },
  postUserDetails: {
    flex: 1,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  postRoute: {
    fontSize: 12,
    color: '#666',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 5,
  },
  tokensBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tokensText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  communitiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  communityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  communityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  communityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  communityIconText: {
    fontSize: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  communityStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SocialScreen;