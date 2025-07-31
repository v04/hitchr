import React, { useState, useEffect } from "react";
import { User, Story } from "@/entities/all";
import { BookOpen, Heart, MessageCircle, Plus, Image } from "lucide-react";
import { format } from "date-fns";
import StoryForm from "../components/stories/StoryForm";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoriesData();
  }, []);

  const loadStoriesData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const storiesList = await Story.list("-created_date");
      
      // Enhance stories with author info
      const enhancedStories = await Promise.all(
        storiesList.map(async (story) => {
          try {
            const users = await User.list();
            const author = users.find(u => u.id === story.author_id);
            return {
              ...story,
              author_display_name: author?.display_name || author?.full_name || 'Anonymous',
              author_avatar: author?.avatar_url
            };
          } catch {
            return {
              ...story,
              author_display_name: 'Anonymous',
              author_avatar: null
            };
          }
        })
      );
      
      setStories(enhancedStories);
    } catch (error) {
      console.error("Failed to load stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoryCreated = () => {
    setShowForm(false);
    loadStoriesData(); // Refresh the stories list
  };

  const handleLike = async (storyId) => {
    try {
      const story = stories.find(s => s.id === storyId);
      if (story) {
        await Story.update(storyId, {
          ...story,
          likes: (story.likes || 0) + 1
        });
        loadStoriesData(); // Refresh to show updated likes
      }
    } catch (error) {
      console.error("Failed to like story:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-3xl p-6 animate-pulse">
              <div className="h-48 bg-white/10 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-4 md:p-6">
        <StoryForm 
          onStoryCreated={handleStoryCreated}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Ride Stories</h1>
              <p className="text-slate-300">Share your adventures and connect with the community</p>
            </div>
            
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary rounded-2xl px-6 py-3 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Share Story</span>
            </button>
          </div>
        </div>

        {/* Stories Feed */}
        {stories.length > 0 ? (
          <div className="space-y-6">
            {stories.map((story) => (
              <div key={story.id} className="glass rounded-3xl p-6">
                {/* Story Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/50 to-purple-500/50 flex items-center justify-center overflow-hidden">
                    {story.author_avatar ? (
                      <img 
                        src={story.author_avatar} 
                        alt="Author" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {story.author_display_name[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {story.author_display_name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {format(new Date(story.created_date), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>

                {/* Story Content */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">{story.title}</h2>
                  <p className="text-slate-200 leading-relaxed">{story.content}</p>
                </div>

                {/* Story Image */}
                {story.image_url && (
                  <div className="mb-4">
                    <img 
                      src={story.image_url} 
                      alt={story.title}
                      className="w-full h-auto max-h-96 object-cover rounded-2xl"
                    />
                  </div>
                )}

                {/* Story Tags */}
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-full text-sm text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Story Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => handleLike(story.id)}
                    className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">{story.likes || 0}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Comment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="w-16 h-16 rounded-full glass-inset flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No stories yet</h3>
            <p className="text-slate-400 mb-6">Be the first to share your ride adventure!</p>
            
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary rounded-2xl px-6 py-3"
            >
              Share Your First Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
}