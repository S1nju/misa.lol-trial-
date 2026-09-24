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

  const nameTrimmedLen = profile.displayName.trim().length;
  const bioTrimmedLen = profile.bio.trim().length;
  const linkLabelTrimmedLen = profile.link.label.trim().length;

  return (
    <form onSubmit={handleSubmit} className="airbnb-card p-6 space-y-5">
      <div className="border-b border-[#EBEBEB] pb-4">
        <h2 className="text-xl font-bold text-[#222222]">Edit Profile</h2>
        <p className="text-sm text-[#717171] mt-0.5">Manage your public identity details</p>
      </div>

      {/* Global Error Banner */}
      {errors['_global'] && (
        <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-[#FFF1F0] border border-[#FFCCC7] text-[#E25275] text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#E25275]" />
          <div>{errors['_global']}</div>
        </div>
      )}

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-[#F6FFED] border border-[#B7EB8F] text-[#008A05] text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-[#008A05] flex-shrink-0" />
          <span>Profile saved successfully!</span>
        </div>
      )}

      {/* Field 1: Display Name */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="displayName" className="font-semibold text-[#222222] flex items-center space-x-1.5">
            <User className="w-4 h-4 text-[#717171]" />
            <span>Display Name</span>
          </label>
          <span className={`text-xs ${nameTrimmedLen > 40 || nameTrimmedLen === 0 ? 'text-[#E25275] font-semibold' : 'text-[#717171]'}`}>
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
          className={`airbnb-input ${errors['displayName'] ? 'airbnb-input-error' : ''}`}
        />
        {errors['displayName'] && (
          <p id="displayName-error" className="text-xs text-[#E25275] flex items-center space-x-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors['displayName']}</span>
          </p>
        )}
      </div>

      {/* Field 2: Bio */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="bio" className="font-semibold text-[#222222] flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-[#717171]" />
            <span>Bio</span>
          </label>
          <span className={`text-xs ${bioTrimmedLen > 160 ? 'text-[#E25275] font-semibold' : 'text-[#717171]'}`}>
            {bioTrimmedLen} / 160
          </span>
        </div>
        <textarea
          id="bio"
          rows={3}
          value={profile.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          disabled={isSaving}
          placeholder="Tell people about yourself..."
          aria-invalid={!!errors['bio']}
          aria-describedby={errors['bio'] ? 'bio-error' : undefined}
          className={`airbnb-input resize-none ${errors['bio'] ? 'airbnb-input-error' : ''}`}
        />
        {errors['bio'] && (
          <p id="bio-error" className="text-xs text-[#E25275] flex items-center space-x-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors['bio']}</span>
          </p>
        )}
      </div>

      {/* Field 3: Link Label */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="linkLabel" className="font-semibold text-[#222222] flex items-center space-x-1.5">
            <Link className="w-4 h-4 text-[#717171]" />
            <span>Link Label</span>
          </label>
          <span className={`text-xs ${linkLabelTrimmedLen > 30 || linkLabelTrimmedLen === 0 ? 'text-[#E25275] font-semibold' : 'text-[#717171]'}`}>
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
          className={`airbnb-input ${errors['link.label'] ? 'airbnb-input-error' : ''}`}
        />
        {errors['link.label'] && (
          <p id="linkLabel-error" className="text-xs text-[#E25275] flex items-center space-x-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors['link.label']}</span>
          </p>
        )}
      </div>

      {/* Field 4: Link URL */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="linkUrl" className="font-semibold text-[#222222] flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-[#717171]" />
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
          className={`airbnb-input ${errors['link.url'] ? 'airbnb-input-error' : ''}`}
        />
        {errors['link.url'] && (
          <p id="linkUrl-error" className="text-xs text-[#E25275] flex items-center space-x-1 mt-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors['link.url']}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-airbnb w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-white" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
