
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { SessionManager } from '../utils/sessionManager';

interface SettingsViewProps { profile: UserProfile; }

const SettingsView: React.FC<SettingsViewProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'developer'>('general');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);

  useEffect(() => {
    if (activeTab === 'developer') {
      const logs = [
        "> cd unique-tv-android",
        "> ./gradlew clean",
        "> Task :app:clean SUCCESS",
        "> ./gradlew assembleDebug",
        "> Starting Unique-Core Gradle Daemon (v8.2)...",
        "> Task :app:preBuild UP-TO-DATE",
        "> Task :app:processDebugResources",
        "[AAPT2] Compiling activity_main_leanback.xml... [OK]",
        "[AAPT2] Compiling colors.xml... [SYNCED]",
        "[AAPT2] Compiling styles.xml... [Theme.ElephTV ACTIVE]",
        "[AAPT2] Merging resources from strings.xml (Brand: ELEPH TV)",
        "> Task :app:processDebugManifest",
        "[MANIFEST] Merging permissions: INTERNET, WAKE_LOCK, RECORD_AUDIO",
        "> Task :app:compileDebugKotlin",
        "[KOTLIN] Compiling HomeActivity.kt...",
        "[KOTLIN] Compiling LoginActivity.kt... [AUTH MODULE]",
        "[KOTLIN] Compiling PlayerController.kt... [EXOPLAYER 2.19.1 ENGINE]",
        "[KOTLIN] Compiling M3UParser.kt... [GIRAFFEPLAYER INTEGRATED]",
        "[KOTLIN] Compiling StreamingData.kt... [DATA LAYER SYNCED]",
        "[KOTLIN] Compiling ApiClient.kt... [RETROFIT STACK]",
        "> Task :app:kaptGenerateStubsDebugKotlin",
        "[KAPT] Processing ViewBinding for Leanback Layouts",
        "> Task :app:assembleDebug SUCCESS",
        ">",
        "> cd /path/to/backend",
        "> pip install -r requirements.txt",
        "[PIP] Installed: Flask, Flask-CORS, PyJWT, gunicorn",
        "> python eleph_tv_model.py",
        "🚀 ElephTV API Core Hub Starting...",
        "📺 Node: http://localhost:5000/api/",
        "🔑 Auth: JWT HS256 Secure Node",
        "📡 Grounding: Google Search Enabled",
        "📊 Data Model: ElephTV Core Class (Live, Movies, Series)",
        "🌐 Streaming: 10 Global HLS Nodes Active",
        "[INFO] Listening at: http://0.0.0.0:5000",
        "> adb shell am start -n com.unique.tv/.activities.LoginActivity",
        "[ADB] Activity manager launched successfully.",
        ">",
        "> Deployment Status: UNIQUE-TV-SIM-V1 [STREAMING_NODES_LIVE]"
      ];
      setBuildLogs([]);
      logs.forEach((log, i) => {
        setTimeout(() => setBuildLogs(prev => [...prev, log]), i * 35);
      });
    }
  }, [activeTab]);

  const logout = () => {
    SessionManager.clearSession();
    window.location.reload();
  };

  const manifestFiles = [
    {
      group: 'Android Build & Configuration',
      files: [
        {
          name: 'build.gradle',
          path: 'app/',
          content: `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-kapt'
}

android {
    namespace 'com.unique.tv'
    compileSdk 34

    defaultConfig {
        applicationId "com.unique.tv"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    buildFeatures {
        viewBinding true
    }
}

dependencies {
    // Core Android
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    
    // ExoPlayer for video streaming
    implementation 'com.google.android.exoplayer:exoplayer:2.19.1'
    implementation 'com.google.android.exoplayer:exoplayer-core:2.19.1'
    implementation 'com.google.android.exoplayer:exoplayer-ui:2.19.1'
    implementation 'com.google.android.exoplayer:exoplayer-hls:2.19.1'
    implementation 'com.google.android.exoplayer:exoplayer-dash:2.19.1'
    implementation 'com.google.android.exoplayer:extension-mediasession:2.19.1'
    
    // M3U Parser for playlist support
    implementation 'com.github.tcking:giraffeplayer2:0.1.25'
    
    // Network & Data
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    implementation 'androidx.room:room-runtime:2.6.1'
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-auth'
}`
        }
      ]
    },
    {
      group: 'ElephTV Data Repository (Kotlin)',
      files: [
        {
          name: 'StreamingData.kt',
          path: 'app/src/main/java/com/eleph/tv/data/',
          content: `package com.eleph.tv.data

object StreamingData {
    
    val LIVE_TV_CHANNELS = listOf(
        StreamItem("1", "ABC News Live", "News", "24/7 News Coverage", "https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8"),
        StreamItem("2", "NASA TV Public", "Education", "NASA Live Stream", "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master_2000.m3u8"),
        StreamItem("3", "France 24 English", "News", "International News", "https://f24hls-i.akamaihd.net/hls/live/221147/F24_EN_LO_HLS/master_2000.m3u8"),
        StreamItem("4", "DW English", "News", "German International", "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"),
        StreamItem("6", "Bloomberg TV", "Business", "Financial News", "https://bloomberg-bloombergtv-2-eu.rakuten.wurl.tv/playlist.m3u8")
    )
    
    val MOVIES = listOf(
        StreamItem("movie_1", "Big Buck Bunny", "Animation", "Short animated film", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"),
        StreamItem("movie_4", "Tears of Steel", "Sci-Fi", "Live action/CGI film", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4")
    )
}

data class StreamItem(
    val id: String,
    val title: String,
    val category: String,
    val description: String,
    val streamUrl: String
)`
        }
      ]
    },
    {
      group: 'UI Resources & Themes',
      files: [
        {
          name: 'colors.xml',
          path: 'app/src/main/res/values/',
          content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="tv_background_dark">#0A0A0A</color>
    <color name="tv_primary">#E50914</color>
    <color name="tv_text_primary">#FFFFFF</color>
    <color name="tv_text_secondary">#B3B3B3</color>
</resources>`
        },
        {
          name: 'styles.xml',
          path: 'app/src/main/res/values/',
          content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.ElephTV" parent="Theme.Leanback">
        <item name="android:windowBackground">@color/tv_background_dark</item>
        <item name="colorPrimary">@color/tv_primary</item>
    </style>
</resources>`
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex items-center gap-8 bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] backdrop-blur-md shadow-2xl">
        <div className={`w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl ${profile.color}`}>
          <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover p-2" />
        </div>
        <div>
          <h3 className="text-3xl font-black tracking-tighter mb-1">{profile.name}</h3>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Authorized Developer Access</p>
        </div>
        <button onClick={logout} className="ml-auto px-8 py-3 bg-white/5 hover:bg-red-600 hover:text-white border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Terminate Session</button>
      </div>

      <div className="flex gap-4 p-2 bg-zinc-900/60 rounded-3xl border border-white/5 w-fit shadow-xl">
        <button onClick={() => setActiveTab('general')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>General</button>
        <button onClick={() => setActiveTab('developer')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'developer' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Developer Portal</button>
      </div>

      {activeTab === 'general' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">App Preferences</h4>
            <div className="space-y-2">
              {[
                { label: 'Autoplay Next Episode', value: true },
                { label: '4K Stream Mapping', value: true },
                { label: 'AI Neural Filtering', value: true }
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:bg-zinc-800/40 transition-colors cursor-pointer group">
                  <span className="font-bold text-sm text-zinc-300 group-hover:text-white transition-colors">{pref.label}</span>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${pref.value ? 'bg-red-600' : 'bg-zinc-800'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.value ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Leanback Diagnostics</h4>
            <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[40px] shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Backend Link</span>
                <span className="text-green-500 font-black text-xs uppercase italic">http://10.0.2.2:5000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Build Variant</span>
                <span className="font-mono text-xs font-black text-red-600">Unique-Release-Candidate</span>
              </div>
              <button onClick={() => alert("Diagnostic Payload Sent.")} className="w-full py-4 border border-zinc-800 hover:border-white/20 hover:bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all mt-4">Run Diagnostics</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-1000">
          <div className="bg-black border border-white/10 rounded-3xl p-6 font-mono text-[11px] h-72 overflow-y-auto scrollbar-hide shadow-inner relative group">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(229,9,20,0.8)]"></div>
                 <span className="text-zinc-500 uppercase tracking-widest font-black">Unique-System-Console</span>
               </div>
               <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">Session: Active</span>
            </div>
            {buildLogs.map((log, i) => (
              <p key={i} className="text-zinc-400 mb-1 animate-in fade-in slide-in-from-left-2 duration-300">
                {log.startsWith('>') ? <span className="text-red-600 mr-2 font-black">➜</span> : null}
                {log.startsWith('[KOTLIN]') ? <span className="text-blue-400 mr-2 font-black">λ</span> : null}
                {log.startsWith('[AAPT2]') ? <span className="text-purple-500 mr-2 font-black">⚙</span> : null}
                {log}
              </p>
            ))}
            {buildLogs.length < 40 && <div className="w-2 h-4 bg-red-600 animate-pulse inline-block ml-1"></div>}
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[40px] backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h4 className="text-2xl font-black tracking-tight uppercase italic">Digital Twin <span className="text-red-600">Manifest</span></h4>
            </div>
            
            <div className="space-y-12">
               {manifestFiles.map((group, gIdx) => (
                 <div key={gIdx} className="space-y-6">
                    <h5 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] px-4">{group.group}</h5>
                    <div className="grid grid-cols-1 gap-8">
                       {group.files.map((file, idx) => (
                         <div key={idx} className="bg-black/40 rounded-[32px] border border-white/5 overflow-hidden group hover:border-red-600/30 transition-all shadow-xl">
                           <div className="flex items-center justify-between p-6 bg-white/5 border-b border-white/5">
                             <p className="text-zinc-400 font-mono text-[11px] font-bold">
                               // {file.path}{file.name}
                             </p>
                           </div>
                           <div className="p-8 font-mono text-[11px] leading-relaxed overflow-x-auto scrollbar-hide whitespace-pre-wrap">
                             <pre className="text-zinc-300">{file.content}</pre>
                           </div>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
