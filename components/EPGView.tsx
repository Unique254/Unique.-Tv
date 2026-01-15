
import React from 'react';
import { EPGProgram } from '../types';
import { MOCK_EPG } from '../constants';

interface EPGViewProps {
  onSelectProgram: (program: EPGProgram) => void;
}

const EPGView: React.FC<EPGViewProps> = ({ onSelectProgram }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EPG.map((program) => (
          <div 
            key={program.id} 
            onClick={() => onSelectProgram(program)}
            className="bg-zinc-900/40 border border-zinc-800/50 rounded-[32px] p-8 hover:bg-zinc-800/60 transition-all group cursor-pointer hover:border-red-600/50 active:scale-95 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="px-4 py-1.5 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/40">Live</div>
              <span className="text-zinc-500 font-mono text-xs font-bold">{program.start} - {program.end}</span>
            </div>
            <h3 className="text-2xl font-black group-hover:text-red-500 transition-colors mb-2 tracking-tight">{program.title}</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{program.channelName}</p>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2">{program.description}</p>
            
            <div className="mt-8 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-red-600 w-1/3 shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-all group-hover:w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Timeline Mockup */}
      <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-6 border-b border-zinc-800/50 bg-zinc-900/50 p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
           <div className="col-span-1">Station</div>
           <div className="col-span-1">08:00</div>
           <div className="col-span-1">10:00</div>
           <div className="col-span-1">12:00</div>
           <div className="col-span-1">14:00</div>
           <div className="col-span-1">16:00</div>
        </div>
        <div className="divide-y divide-zinc-800/50">
           {['Global News 24', 'Sports HD 1', 'Discovery Pro', 'Cinema Ultra'].map((chan, i) => (
             <div key={i} className="grid grid-cols-6 p-8 items-center group hover:bg-white/5 transition-all cursor-pointer">
                <div className="col-span-1 font-black text-sm text-zinc-400 group-hover:text-white group-hover:translate-x-2 transition-transform">{chan}</div>
                <div className="col-span-2 px-3">
                   <div className="bg-zinc-800/40 p-5 rounded-2xl border border-zinc-700/30 text-xs text-zinc-400 font-bold hover:bg-zinc-700/40 transition-colors">Morning Highlights</div>
                </div>
                <div className="col-span-3 px-3">
                   <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800/50 text-xs text-zinc-600 font-bold">Upcoming Segment</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default EPGView;
