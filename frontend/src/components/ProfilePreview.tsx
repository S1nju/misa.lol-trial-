import React from 'react';
import type { Profile } from '../types';
import { isValidHttpsUrl } from '../utils/urlValidator';
import { ExternalLink, Link2Off, User, Sparkles } from 'lucide-react';

interface ProfilePreviewProps {
  profile: Profile;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profile }) => {
  const { displayName, bio, link } = profile;
  const isUrlValid = isValidHttpsUrl(link.url);

  const initial = displayName.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF385C] flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </span>
        <span className="text-xs text-[#717171]">Updates as you type</span>
      </div>

      <div className="airbnb-card-hover p-8 flex flex-col items-center text-center relative overflow-hidden bg-white">
        {/* Soft gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF385C] via-[#E51E54] to-[#D70466]" />

        {/* Avatar */}
        <div className="relative mb-5 mt-2">
          <div className="w-24 h-24 rounded-full bg-[#F7F7F7] border-2 border-[#EBEBEB] flex items-center justify-center text-3xl font-bold text-[#222222] shadow-sm">
            {initial !== '?' ? initial : <User className="w-10 h-10 text-[#B0B0B0]" />}
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#008A05] border-2 border-white rounded-full" />
        </div>

        {/* Display Name */}
        <h2 className="text-2xl font-bold tracking-tight text-[#222222] mb-2 max-w-full break-words">
          {displayName.trim() || <span className="text-[#B0B0B0] italic font-normal">Your Name</span>}
        </h2>

        {/* Bio */}
        <p className="text-sm text-[#717171] leading-relaxed max-w-sm mb-6 whitespace-pre-wrap break-words">
          {bio.trim() || <span className="text-[#B0B0B0] italic">No bio provided yet.</span>}
        </p>

        {/* External Link Pill Button */}
        <div className="w-full max-w-xs pt-4 border-t border-[#EBEBEB]">
          {isUrlValid ? (
            <a
              href={link.url.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-between px-5 py-3 rounded-full bg-[#222222] hover:bg-[#000000] text-white transition-all duration-200 shadow-md"
              aria-label={`Open ${link.label || 'link'} in new tab`}
            >
              <span className="text-sm font-semibold truncate pr-2">
                {link.label.trim() || 'My Website'}
              </span>
              <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
            </a>
          ) : (
            <div className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-[#F7F7F7] border border-[#DDDDDD] text-[#717171] cursor-not-allowed">
              <span className="text-sm font-medium truncate pr-2">
                {link.label.trim() || 'My Website'}
              </span>
              <div className="flex items-center space-x-1 text-[#E25275] text-xs bg-[#FFF1F0] px-2.5 py-1 rounded-full border border-[#FFCCC7] flex-shrink-0 font-medium">
                <Link2Off className="w-3.5 h-3.5 mr-1" />
                <span>Invalid Link</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
