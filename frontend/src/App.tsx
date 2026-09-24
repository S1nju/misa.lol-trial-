import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProfileForm } from './components/ProfileForm';
import { ProfilePreview } from './components/ProfilePreview';
import type { Profile, ApiErrorResponse } from './types';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

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

  // Fetch initial profile from backend on mount
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

      // Server returns updated profile
      const savedProfile: Profile = responseData;
      setProfile(savedProfile);
      setSaveSuccess(true);

      // Auto hide success banner after 4 seconds
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
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] glow-gradient pointer-events-none" />

      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 z-10 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="text-sm text-slate-400">Loading profile data from server...</p>
          </div>
        ) : loadError ? (
          <div className="max-w-md mx-auto my-12 glass-panel p-6 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Connection Failed</h3>
            <p className="text-sm text-slate-400">{loadError}</p>
            <button
              onClick={fetchProfile}
              className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
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
            <div className="lg:col-span-5 sticky top-24">
              <ProfilePreview profile={profile} />
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-white/5 py-4 text-center text-xs text-slate-500">
        misa.lol profile editor trial exercise • full-stack implementation
      </footer>
    </div>
  );
};

export default App;
