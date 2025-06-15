
import React from 'react';
import { MediaItem } from '../types';
import Panel from './Panel';

interface MediaGridPanelProps {
  mediaItems: MediaItem[];
}

const MediaGridPanel: React.FC<MediaGridPanelProps> = ({ mediaItems }) => {
  console.log(`[MediaGridPanel] Rendering with mediaItems count: ${mediaItems.length}`, mediaItems);
  return (
    <Panel title="Visual Intel Feed" contentClassName="grid grid-cols-2 grid-rows-3 gap-2">
      {mediaItems.length === 0 && <p className="text-gray-500 col-span-2 row-span-3 flex items-center justify-center">No visual data streams active.</p>}
      {mediaItems.slice(0, 6).map((item) => ( // Display up to 6 items
        <div key={item.id} className="relative aspect-video bg-black border border-cyan-900/70 group">
          <img src={item.url} alt={item.location} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/80 text-xs">
            <p className="text-yellow-400 truncate">📍 {item.location}</p>
            <p className="text-sky-400">T: {item.time} | SRC: <span className="text-purple-400">{item.source}</span></p>
          </div>
        </div>
      ))}
    </Panel>
  );
};

export default MediaGridPanel;
