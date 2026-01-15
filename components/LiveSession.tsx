
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, Modality, Type, LiveServerMessage } from '@google/genai';
import { Icons } from '../constants';

interface LiveSessionProps {
  onClose: () => void;
  onSearchRequest: (query: string) => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ onClose, onSearchRequest }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'error' | 'closed'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Manual Base64 Implementation as per requirements
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (outputContextRef.current) {
      outputContextRef.current.close();
    }
    sourcesRef.current.forEach(s => s.stop());
    setStatus('closed');
  }, []);

  useEffect(() => {
    let intervalId: number;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).catch(() => {
          // Fallback to audio only if camera is unavailable or denied
          return navigator.mediaDevices.getUserMedia({ audio: true });
        });

        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          setHasCamera(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = outputContextRef.current.createGain();
        outputNode.connect(outputContextRef.current.destination);

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('active');
              const source = audioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextRef.current!.destination);

              // Video streaming logic
              if (videoTrack) {
                intervalId = window.setInterval(() => {
                  if (!videoRef.current || !canvasRef.current) return;
                  const ctx = canvasRef.current.getContext('2d');
                  if (!ctx) return;
                  
                  canvasRef.current.width = videoRef.current.videoWidth || 320;
                  canvasRef.current.height = videoRef.current.videoHeight || 240;
                  ctx.drawImage(videoRef.current, 0, 0);
                  
                  canvasRef.current.toBlob(async (blob) => {
                    if (blob) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = (reader.result as string).split(',')[1];
                        sessionPromise.then(s => s.sendRealtimeInput({ 
                          media: { data: base64, mimeType: 'image/jpeg' } 
                        }));
                      };
                      reader.readAsDataURL(blob);
                    }
                  }, 'image/jpeg', 0.6);
                }, 1000);
              }
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Tool Calls
              if (message.toolCall) {
                for (const fc of message.toolCall.functionCalls) {
                  if (fc.name === 'searchMovies') {
                    onSearchRequest(fc.args.query as string);
                    sessionPromise.then(s => s.sendToolResponse({
                      functionResponses: [{ id: fc.id, name: fc.name, response: { result: "ok, searching for " + fc.args.query } }]
                    }));
                  }
                }
              }

              // Handle Audio Output
              const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioBase64 && outputContextRef.current) {
                const ctx = outputContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                source.onended = () => sourcesRef.current.delete(source);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error("Live Error", e);
              setStatus('error');
            },
            onclose: () => setStatus('closed'),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
            systemInstruction: `You are the AI interface for Unique TV. 
            You can search for movies by calling the 'searchMovies' tool.
            Be helpful, cinematic, and use a friendly voice.
            If the user asks to see something or shows you something via camera, use visual context to recommend movies.`,
            tools: [{
              functionDeclarations: [{
                name: 'searchMovies',
                description: 'Search for movies or genres in the app catalog.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    query: { type: Type.STRING, description: 'The search term or genre.' }
                  },
                  required: ['query']
                }
              }]
            }]
          },
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error("Setup failed", err);
        setStatus('error');
      }
    };

    start();
    return () => {
      if (intervalId) clearInterval(intervalId);
      stopSession();
    };
  }, [onSearchRequest, isMuted, stopSession]);

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white">
      <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors">
        <Icons.X />
      </button>

      <div className="max-w-4xl w-full flex flex-col items-center gap-12">
        {/* Status indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              status === 'active' ? 'border-red-600 animate-pulse scale-110' : 'border-zinc-800'
            }`}>
              {status === 'active' ? <div className="w-12 h-12 bg-red-600 rounded-full shadow-[0_0_30px_rgba(229,9,20,0.5)]"></div> : <div className="w-8 h-8 bg-zinc-800 rounded-full"></div>}
            </div>
            {status === 'active' && (
              <div className="absolute -inset-4 border-2 border-red-600/20 rounded-full animate-ping"></div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              {status === 'connecting' && "Connecting to AI Core..."}
              {status === 'active' && "AI Live Listening..."}
              {status === 'error' && "Connection Error"}
              {status === 'closed' && "Session Ended"}
            </h2>
            <p className="text-zinc-500 text-sm mt-2">Try saying "Search for sci-fi movies" or "Recommend something based on my room vibe"</p>
          </div>
        </div>

        {/* Vision Feed (if camera active) */}
        <div className={`relative w-full max-w-lg aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl transition-opacity duration-700 ${hasCamera ? 'opacity-100' : 'opacity-0 h-0'}`}>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-60" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live Vision Feed</span>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              isMuted ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 text-white shadow-lg shadow-red-900/30'
            }`}
          >
            <Icons.Mic />
          </button>
          <button 
            onClick={stopSession}
            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-bold transition-all border border-zinc-700"
          >
            End Live Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
