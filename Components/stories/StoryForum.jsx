import React, { useState } from "react";
import { User, Story } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X, Loader2, Plus } from "lucide-react";

export default function StoryForm({ onStoryCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    image_url: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      const user = await User.me();
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await Story.create({
        title: formData.title,
        content: formData.content,
        tags: tagsArray,
        image_url: formData.image_url || null,
        author_id: user.id
      });

      onStoryCreated();
    } catch (error) {
      console.error("Failed to create story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Share Your Story</h2>
          <button
            onClick={onCancel}
            className="glass rounded-xl p-2 glass-hover"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Story Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your story a catchy title..."
              className="glass-inset bg-transparent border-white/10 text-white placeholder-slate-400"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Your Story
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Tell us about your ride adventure..."
              rows={6}
              className="glass-inset bg-transparent border-white/10 text-white placeholder-slate-400 resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Add Photo (Optional)
            </label>
            
            {formData.image_url ? (
              <div className="relative">
                <img 
                  src={formData.image_url} 
                  alt="Story" 
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                  className="absolute top-2 right-2 glass rounded-full p-2"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="glass-inset rounded-2xl p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="story-image"
                  disabled={isUploading}
                />
                <label
                  htmlFor="story-image"
                  className={`cursor-pointer flex flex-col items-center gap-3 ${
                    isUploading ? 'opacity-50' : ''
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-400" />
                  )}
                  <span className="text-slate-300">
                    {isUploading ? 'Uploading...' : 'Click to add a photo'}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Tags (Optional)
            </label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="adventure, highway, friendship (separated by commas)"
              className="glass-inset bg-transparent border-white/10 text-white placeholder-slate-400"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              className="glass glass-hover text-slate-200 flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="btn-primary flex-1 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Share Story
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}