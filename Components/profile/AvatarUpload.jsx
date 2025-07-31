import React, { useState } from "react";
import { User } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Camera, Loader2, User as UserIcon } from "lucide-react";

export default function AvatarUpload({ currentUser, onAvatarUpdated }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ avatar_url: file_url });
      onAvatarUpdated(file_url);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
        {currentUser?.avatar_url ? (
          <img 
            src={currentUser.avatar_url} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-3xl">
            {(currentUser?.display_name || currentUser?.full_name || 'U')[0]}
          </span>
        )}
      </div>
      
      {/* Upload Button */}
      <div className="absolute -bottom-2 -right-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
          id="avatar-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="avatar-upload"
          className={`glass rounded-full p-2 cursor-pointer glass-hover ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </label>
      </div>
    </div>
  );
}