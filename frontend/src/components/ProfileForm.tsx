import React from 'react';
import type { Profile } from '../types';
import { User, FileText, Link, Globe, Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

interface ProfileFormProps {
  profile: Profile;
  onChange: (updated: Profile) => void;
  onSave: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  errors: Record<string, string>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChange,
  onSave,
  isSaving,
  saveSuccess,
  errors,
}) => {
  const handleChange = (field: keyof Profile | 'link.label' | 'link.url', value: string) => {
    if (field === 'link.label') {
      onChange({
        ...profile,
        link: { ...profile.link, label: value },
      });
    } else if (field === 'link.url') {
      onChange({
        ...profile,
        link: { ...profile.link, url: value },
      });
    } else {
      onChange({
        ...profile,
        [field]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSaving) {
      onSave();
    }
  };

  // Character counts
  const nameTrimmedLen = profile.displayName.trim().length;
  const bioTrimmedLen = profile.bio.trim().length;
  const linkLabelTrimmedLen = profile.link.label.trim().length;

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 space-y-5 text-slate-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <p className="text-xs text-slate-400">Update your identity and link details</p>
        </div>
      </div>

      {/* Global Error Banner */}
      {errors['_global'] && (
        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div>{errors['_global']}</div>
        </div>
      )}

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Profile saved successfully to server!</span>
        </div>
      )}

      {/* Field 1: Display Name */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="displayName" className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span>Display Name</span>
          </label>
          <span className={`text-[11px] ${nameTrimmedLen > 40 || nameTrimmedLen === 0 ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
            {nameTrimmedLen} / 40
          </span>
        </div>
        <input
          id="displayName"
          type="text"
          value={profile.displayName}
          onChange={(e) => handleChange('displayName', e.target.value)}
          disabled={isSaving}
          placeholder="e.g. Nova"
          aria-invalid={!!errors['displayName']}
          aria-describedby={errors['displayName'] ? 'displayName-error' : undefined}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border transition-all text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
            errors['displayName']
              ? 'border-rose-500/80 focus:ring-rose-500/40'
              : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/30'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {errors['displayName'] && (
          <p id="displayName-error" className="text-xs text-rose-400 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errors['displayName']}</span>
          </p>
        )}
      </div>

      {/* Field 2: Bio */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="bio" className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Bio</span>
          </label>
          <span className={`text-[11px] ${bioTrimmedLen > 160 ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
            {bioTrimmedLen} / 160
          </span>
        </div>
        <textarea
          id="bio"
          rows={3}
          value={profile.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          disabled={isSaving}
          placeholder="Tell the world about yourself..."
          aria-invalid={!!errors['bio']}
          aria-describedby={errors['bio'] ? 'bio-error' : undefined}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border transition-all text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
            errors['bio']
              ? 'border-rose-500/80 focus:ring-rose-500/40'
              : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/30'
          } disabled:opacity-50 disabled:cursor-not-allowed resize-none`}
        />
        {errors['bio'] && (
          <p id="bio-error" className="text-xs text-rose-400 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errors['bio']}</span>
          </p>
        )}
      </div>

      {/* Field 3: Link Label */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="linkLabel" className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <Link className="w-3.5 h-3.5 text-purple-400" />
            <span>Link Label</span>
          </label>
          <span className={`text-[11px] ${linkLabelTrimmedLen > 30 || linkLabelTrimmedLen === 0 ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
            {linkLabelTrimmedLen} / 30
          </span>
        </div>
        <input
          id="linkLabel"
          type="text"
          value={profile.link.label}
          onChange={(e) => handleChange('link.label', e.target.value)}
          disabled={isSaving}
          placeholder="e.g. My website"
          aria-invalid={!!errors['link.label']}
          aria-describedby={errors['link.label'] ? 'linkLabel-error' : undefined}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border transition-all text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
            errors['link.label']
              ? 'border-rose-500/80 focus:ring-rose-500/40'
              : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/30'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {errors['link.label'] && (
          <p id="linkLabel-error" className="text-xs text-rose-400 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errors['link.label']}</span>
          </p>
        )}
      </div>

      {/* Field 4: Link URL */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="linkUrl" className="font-semibold text-slate-300 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Link URL (Must start with https://)</span>
          </label>
        </div>
        <input
          id="linkUrl"
          type="text"
          value={profile.link.url}
          onChange={(e) => handleChange('link.url', e.target.value)}
          disabled={isSaving}
          placeholder="https://example.com"
          aria-invalid={!!errors['link.url']}
          aria-describedby={errors['link.url'] ? 'linkUrl-error' : undefined}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border transition-all text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
            errors['link.url']
              ? 'border-rose-500/80 focus:ring-rose-500/40'
              : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/30'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {errors['link.url'] && (
          <p id="linkUrl-error" className="text-xs text-rose-400 flex items-center space-x-1 mt-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{errors['link.url']}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary w-full py-3 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
