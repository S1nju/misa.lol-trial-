import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProfileForm } from './components/ProfileForm';
import { ProfilePreview } from './components/ProfilePreview';
import type { Profile, ApiErrorResponse } from './types';

const INITIAL_STATE: Profile = {
  displayName: '',
  bio: '',
  link: {
    label: '',
    url: '',
  },
};

export const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error(`Failed to load profile (Status: ${response.status})`);
      }
      const data: Profile = await response.json();
      setProfile(data);
    } catch (err: any) {
      setLoadError(err.message || 'Unable to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileChange = (updated: Profile) => {
    setProfile(updated);
    if (saveSuccess) setSaveSuccess(false);
    if (Object.keys(errors).length > 0) setErrors({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrors({});

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errData = responseData as ApiErrorResponse;
        if (errData.details) {
          setErrors(errData.details);
        } else {
          setErrors({ _global: errData.error || 'Failed to save profile changes.' });
        }
        return;
      }

      const savedProfile: Profile = responseData;
      setProfile(savedProfile);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);

    } catch (err: any) {
      setErrors({ _global: 'Network error. Could not reach server to save profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] text-[#222222] flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full px-4 sm:px-6 py-8 md:py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
            <p className="text-sm font-medium text-[#717171]">Loading profile data...</p>
          </div>
        ) : loadError ? (
          <div className="max-w-md mx-auto card-surface text-center space-y-4">
            <h3 className="text-lg font-bold text-[#222222]">Connection Failed</h3>
            <p className="text-xs text-[#717171]">{loadError}</p>
            <button
              onClick={fetchProfile}
              className="btn-primary"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="editor-layout">
            {/* Form Column */}
            <div className="editor-form-col">
              <ProfileForm
                profile={profile}
                onChange={handleProfileChange}
                onSave={handleSave}
                isSaving={isSaving}
                saveSuccess={saveSuccess}
                errors={errors}
              />
            </div>

            {/* Preview Column */}
            <div className="editor-preview-col">
              <ProfilePreview profile={profile} />
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-[#EBEBEB] py-6 text-center text-xs text-[#717171] bg-white">
        misa.lol profile editor trial • Airbnb UI Design System
      </footer>
    </div>
  );
};

export default App;
