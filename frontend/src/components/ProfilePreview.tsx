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

  // Avatar initial from display name
  const initial = displayName.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </span>
        <span className="text-xs text-slate-500">Updates as you type</span>
      </div>

      <div className="floating-card rounded-2xl p-6 text-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop behind avatar */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-[2px] shadow-xl shadow-purple-500/20">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white tracking-wider">
              {initial !== '?' ? initial : <User className="w-8 h-8 text-slate-400" />}
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
        </div>

        {/* Display Name */}
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2 max-w-full break-words">
          {displayName.trim() || <span className="text-slate-500 italic">Your Name</span>}
        </h2>

        {/* Bio */}
        <p className="text-sm text-slate-300 leading-relaxed max-w-sm mb-6 whitespace-pre-wrap break-words">
          {bio.trim() || <span className="text-slate-500 italic">No bio provided yet.</span>}
        </p>

        {/* External Link */}
        <div className="w-full max-w-xs pt-2 border-t border-white/10">
          {isUrlValid ? (
            <a
              href={link.url.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/60 text-purple-200 transition-all duration-200 shadow-md shadow-purple-950/40"
              aria-label={`Open ${link.label || 'link'} in new tab`}
            >
              <span className="text-sm font-medium truncate pr-2">
                {link.label.trim() || 'My Website'}
              </span>
              <ExternalLink className="w-4 h-4 text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
            </a>
          ) : (
            <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-400 cursor-not-allowed opacity-80">
              <span className="text-sm font-medium truncate pr-2">
                {link.label.trim() || 'My Website'}
              </span>
              <div className="flex items-center space-x-1 text-amber-400/90 text-xs bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 flex-shrink-0">
                <Link2Off className="w-3.5 h-3.5 mr-1" />
                <span>Invalid URL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
