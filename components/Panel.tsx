
import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  headerContent?: React.ReactNode; // Optional content for the header right side
}

const Panel: React.FC<PanelProps> = ({ title, children, className = '', titleClassName = '', contentClassName = '', headerContent }) => {
  return (
    <div className={`bg-black/70 border border-cyan-700/50 shadow-xl shadow-cyan-900/50 backdrop-blur-sm flex flex-col ${className}`}>
      <div className={`p-2 border-b border-cyan-700/50 flex justify-between items-center ${titleClassName}`}>
        <h2 className="font-pixel text-lg uppercase text-pink-400 tracking-wider">{title}</h2>
        {headerContent}
      </div>
      <div className={`p-2 flex-grow overflow-y-auto terminal-scrollbar ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Panel;
