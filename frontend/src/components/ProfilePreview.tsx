import React from 'react';
import type { Profile } from '../types';
import { isValidHttpsUrl } from '../utils/urlValidator';

interface ProfilePreviewProps {
  profile: Profile;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profile }) => {
  const { displayName, bio, link } = profile;
  const isUrlValid = isValidHttpsUrl(link.url);

  const initial = displayName.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">
          Live Preview
        </span>
        <span className="text-xs text-[#717171]">Updates as you type</span>
      </div>

      <div className="preview-card">
        {/* Avatar Circle */}
        <div className="preview-avatar">
          {initial}
        </div>

        {/* Display Name */}
        <h2 className="preview-name">
          {displayName.trim() || <span className="text-[#B0B0B0] font-normal italic">Your Name</span>}
        </h2>

        {/* Bio */}
        <p className="preview-bio">
          {bio.trim() || <span className="text-[#B0B0B0] italic">No bio provided yet.</span>}
        </p>

        {/* External Link Pill Button */}
        <div className="pt-2 border-t border-[#EBEBEB]">
          {isUrlValid ? (
            <a
              href={link.url.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="preview-link-btn"
              aria-label={`Open ${link.label || 'link'} in new tab`}
            >
              {link.label.trim() || 'My Website'}
            </a>
          ) : (
            <div className="preview-link-disabled">
              {link.label.trim() || 'My Website'} (Invalid URL)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
