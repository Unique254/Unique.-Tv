import React from 'react';
import { Movie, StreamItem } from '../types';
import { Icons } from '../constants';

interface VideoCardProps {
  movie: Movie | StreamItem;
  onClick: (item: any) => void;
  onGenerateTrailer?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ movie, onClick, onGenerateTrailer, onToggleFavorite, isFavorite }) => {
  const isLive = 'isLive' in movie ? movie.isLive : false;
  const isFree = 'isFree' in movie ? movie.isFree : true;
  const rating = 'rating' in movie ? movie.rating : null;
  const year = 'year' in movie ? movie.year : null;
  const duration = 'duration' in movie ? movie.duration : null;

  return (
    <div 
      className="group relative cursor-pointer flex flex-col gap-3 transition-all duration-300 ease-out hover:scale-[1.1] focus-within:scale-[1.1] focus:outline-none"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(movie)}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-md group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.8)] group-hover:border-red-600/50 group-focus-within:shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-all duration-300">
        <img 
          onClick={() => onClick(movie)} 
          src={movie.thumbnail} 
          alt={movie.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
            <Icons.Play />
          </div>
        </div>

        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          {isLive && (
            <div className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
              LIVE
            </div>
          )}
          {isFree && (
            <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
              FREE
            </div>
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(movie.id); }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all duration-300 ${isFavorite ? 'bg-red-600 border-red-500 text-white' : 'bg-black/40 border-white/10 text-white opacity-0 group-hover:opacity-100 focus:opacity-100'}`}
        >
          <Icons.Heart />
        </button>

        {'isGeneratingTrailer' in movie && movie.isGeneratingTrailer && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 z-10">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Generating AI Trailer</span>
          </div>
        )}
      </div>

      <div className="px-1 flex flex-col gap-1">
        <h3 className="font-black text-sm tracking-tight text-zinc-100 truncate group-hover:text-red-500 transition-colors uppercase">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded">{movie.category}</span>
          {year && <span className="text-[10px] font-bold text-zinc-700 italic">{year}</span>}
          {rating && (
            <span className="ml-auto text-[10px] font-black text-yellow-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;