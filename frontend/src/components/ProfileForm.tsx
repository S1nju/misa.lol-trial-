import React from 'react';
import type { Profile } from '../types';

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
    <form onSubmit={handleSubmit} className="card-surface">
      <div className="mb-6 pb-4 border-b border-[#EBEBEB]">
        <h2 className="text-xl font-bold text-[#222222]">Edit Profile</h2>
        <p className="text-xs text-[#717171] mt-1">Manage your public identity details</p>
      </div>

      {/* Global Error Banner */}
      {errors['_global'] && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#FFF1F0] border border-[#FFCCC7] text-[#E25275] text-xs font-semibold">
          {errors['_global']}
        </div>
      )}

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#F6FFED] border border-[#B7EB8F] text-[#008A05] text-xs font-semibold">
          Profile saved successfully!
        </div>
      )}

      {/* Field 1: Display Name */}
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="displayName" className="form-label">
            Display Name
          </label>
          <span className={`char-counter ${nameTrimmedLen > 40 || nameTrimmedLen === 0 ? 'error' : ''}`}>
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
          className={`form-input ${errors['displayName'] ? 'has-error' : ''}`}
        />
        {errors['displayName'] && (
          <p className="field-error">{errors['displayName']}</p>
        )}
      </div>

      {/* Field 2: Bio */}
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <span className={`char-counter ${bioTrimmedLen > 160 ? 'error' : ''}`}>
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
          className={`form-input resize-none ${errors['bio'] ? 'has-error' : ''}`}
        />
        {errors['bio'] && (
          <p className="field-error">{errors['bio']}</p>
        )}
      </div>

      {/* Field 3: Link Label */}
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="linkLabel" className="form-label">
            Link Label
          </label>
          <span className={`char-counter ${linkLabelTrimmedLen > 30 || linkLabelTrimmedLen === 0 ? 'error' : ''}`}>
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
          className={`form-input ${errors['link.label'] ? 'has-error' : ''}`}
        />
        {errors['link.label'] && (
          <p className="field-error">{errors['link.label']}</p>
        )}
      </div>

      {/* Field 4: Link URL */}
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="linkUrl" className="form-label">
            Link URL (Must start with https://)
          </label>
        </div>
        <input
          id="linkUrl"
          type="text"
          value={profile.link.url}
          onChange={(e) => handleChange('link.url', e.target.value)}
          disabled={isSaving}
          placeholder="https://example.com"
          className={`form-input ${errors['link.url'] ? 'has-error' : ''}`}
        />
        {errors['link.url'] && (
          <p className="field-error">{errors['link.url']}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};
