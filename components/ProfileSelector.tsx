
import React from 'react';
import { UserProfile } from '../types';
import { PROFILES } from '../constants';

interface ProfileSelectorProps {
  onSelect: (profile: UserProfile) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Who's watching?</h1>
        <p className="text-zinc-500 text-lg">Select a profile to continue to Unique TV</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-10">
        {PROFILES.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelect(profile)}
            className="group flex flex-col items-center gap-6"
          >
            <div className={`w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden border-4 border-transparent group-hover:border-white group-hover:scale-110 transition-all duration-300 shadow-2xl relative ${profile.color}`}>
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover p-4 opacity-90 group-hover:opacity-100" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-zinc-400 group-hover:text-white transition-colors">{profile.name}</span>
          </button>
        ))}
        
        <button className="flex flex-col items-center gap-6 group opacity-50 hover:opacity-100 transition-opacity">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl border-2 border-zinc-700 border-dashed flex items-center justify-center group-hover:bg-zinc-900 group-hover:border-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-xl md:text-2xl font-bold text-zinc-500 group-hover:text-white">Add Profile</span>
        </button>
      </div>

      <button className="mt-20 px-10 py-3 border border-zinc-700 text-zinc-500 font-bold rounded-xl hover:border-white hover:text-white transition-all tracking-widest uppercase text-sm">
        Manage Profiles
      </button>
    </div>
  );
};

export default ProfileSelector;
