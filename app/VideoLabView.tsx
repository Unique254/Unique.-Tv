
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Icons } from '../constants';

const LOADING_MESSAGES = [
  "Initializing neural render engine...",
  "Synthesizing temporal coherence...",
  "Gemini is weaving the fabric of your story...",
  "Finalizing cinematic textures...",
  "Calculating light trajectories...",
  "Polishing frame transitions..."
];

const VideoLabView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<any>(null);

  const startGeneration = async () => {
    if (!prompt.trim()) return;

    // Billing check for Veo models
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Guideline: assume success and proceed
      }
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setLoadingMsgIdx(0);

    const msgInterval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 8000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedVideoUrl(url);
        setLastOperation(operation);
      } else {
        throw new Error("Failed to retrieve generated video.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key Error. Please re-select your paid API key via Settings or the key dialog.");
        if (window.aistudio) await window.aistudio.openSelectKey();
      } else {
        setError(err.message || "An error occurred during video generation.");
      }
    } finally {
      setIsGenerating(false);
      clearInterval(msgInterval);
    }
  };

  const extendVideo = async () => {
    if (!lastOperation || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: 'Something unexpected happens',
        video: lastOperation.response?.generatedVideos?.[0]?.video,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio,
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setGeneratedVideoUrl(url);
        setLastOperation(operation);
      }
    } catch (err: any) {
      setError(err.message || "Failed to extend video.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Editor Controls */}
        <div className="flex-1 space-y-8 bg-zinc-900/30 border border-white/5 p-10 rounded-[40px] backdrop-blur-xl">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Creative Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cyber-city during a neon rainstorm, cinematic slow motion, 8k textures..."
              className="w-full h-40 bg-black/40 border border-white/5 rounded-3xl p-6 focus:outline-none focus:ring-4 focus:ring-red-600/20 focus:border-red-600 transition-all text-zinc-100 placeholder:text-zinc-600 font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Aspect Ratio</h3>
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {(['16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${aspectRatio === ratio ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Resolution</h3>
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {(['720p', '1080p'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${resolution === res ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startGeneration}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black rounded-3xl text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-red-900/40 transform active:scale-95 flex items-center justify-center gap-4"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Icons.Sparkles /> Generate Cinematic Scene</>
            )}
          </button>

          <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">
            Powered by Veo 3.1 Neural Engines • Required Paid API Key
          </p>
        </div>

        {/* Preview Area */}
        <div className="flex-1 min-h-[500px] relative rounded-[40px] border border-white/5 bg-zinc-900/20 overflow-hidden flex items-center justify-center group">
          {isGenerating ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
               <div className="relative mb-12">
                 <div className="w-24 h-24 border-4 border-red-600/20 rounded-full animate-ping absolute -inset-4"></div>
                 <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
               </div>
               <h3 className="text-xl font-black tracking-tight mb-4">{LOADING_MESSAGES[loadingMsgIdx]}</h3>
               <p className="text-zinc-500 text-sm font-medium animate-pulse">This process typically takes 1-3 minutes...</p>
            </div>
          ) : generatedVideoUrl ? (
            <div className="w-full h-full flex flex-col">
              <video 
                src={generatedVideoUrl} 
                controls 
                className="w-full h-full object-contain bg-black"
                autoPlay
                loop
              />
              <div className="absolute top-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={extendVideo} className="px-6 py-3 bg-white/10 backdrop-blur-md hover:bg-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                  Extend +7s
                </button>
                <a 
                  href={generatedVideoUrl} 
                  download="unique_tv_ai_clip.mp4"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
                >
                  Download
                </a>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-12 space-y-6">
              <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto border border-red-600/20">
                <Icons.X />
              </div>
              <p className="text-red-500 font-bold max-w-sm mx-auto">{error}</p>
              <button onClick={() => setError(null)} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Dismiss</button>
            </div>
          ) : (
            <div className="text-center p-12 opacity-30 select-none">
              <div className="mb-8 scale-150 flex justify-center"><Icons.Camera /></div>
              <p className="font-black uppercase tracking-[0.2em] text-sm">Visual Synthesis Idle</p>
              <p className="text-xs mt-2 font-bold">Input a prompt to begin rendering</p>
            </div>
          )}
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Icons.Sparkles, title: "Neural Rendering", desc: "State-of-the-art video synthesis with Veo 3.1 Fast." },
          { icon: Icons.Film, title: "Temporal Coherence", desc: "Maintain visual consistency across frames with AI motion vectors." },
          { icon: Icons.Trending, title: "Industry Standard", desc: "Output in 1080p cinematic resolution ready for production." }
        ].map((feat, i) => (
          <div key={i} className="p-8 bg-zinc-900/20 border border-white/5 rounded-[32px] hover:border-red-600/20 transition-all group">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-zinc-400 group-hover:text-red-500 transition-colors">
              <feat.icon />
            </div>
            <h4 className="text-lg font-black mb-2">{feat.title}</h4>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoLabView;
