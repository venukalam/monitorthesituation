
import React from 'react';
import { ViewMode } from '../types';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';

interface HeaderProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ isSimulating, onToggleSimulation, currentView, onChangeView }) => {
  const viewModes: { id: ViewMode; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'map_only', label: 'Map Only' },
    { id: 'terminal_only', label: 'Intel Feeds' },
  ];

  return (
    <header className="p-3 bg-black/80 backdrop-blur-sm border-b border-cyan-700/50 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50">
      <h1 className="font-pixel text-3xl sm:text-4xl text-red-400 tracking-wider mb-2 sm:mb-0">
        MONITOR THE SITUATION
      </h1>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="flex space-x-1">
          {viewModes.map(vm => (
            <button
              key={vm.id}
              onClick={() => onChangeView(vm.id)}
              className={`px-2 py-1 text-xs sm:text-sm border rounded transition-colors
                ${currentView === vm.id 
                  ? 'bg-cyan-400 text-black border-cyan-300' // Brighter active button
                  : 'text-cyan-400 border-cyan-600 hover:bg-cyan-700 hover:text-white'}`}
            >
              {vm.label}
            </button>
          ))}
        </div>
        <button
          onClick={onToggleSimulation}
          className="p-2 border border-cyan-600 rounded text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
          aria-label={isSimulating ? "Pause Simulation" : "Resume Simulation"}
        >
          {isSimulating ? <PauseIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
