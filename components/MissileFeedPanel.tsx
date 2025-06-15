
import React from 'react';
import { MissileLaunch, MissileStatus } from '../types';
import Panel from './Panel';

interface MissileFeedPanelProps {
  launches: MissileLaunch[];
}

const getStatusColor = (status: MissileStatus): string => {
  switch (status) {
    case MissileStatus.EN_ROUTE: return "text-pink-400"; // Hot Pink
    case MissileStatus.LAUNCH_DETECTED: return "text-yellow-400"; // Electric Yellow
    case MissileStatus.INTERCEPTED: return "text-blue-400"; // Bright Blue
    case MissileStatus.IMPACTED: return "text-red-500"; // Fiery Red
    default: return "text-gray-400";
  }
};

const MissileFeedPanel: React.FC<MissileFeedPanelProps> = ({ launches }) => {
  return (
    <Panel title="Tactical Feed: Missile Activity" contentClassName="text-sm">
      <div className="space-y-2">
        {launches.length === 0 && <p className="text-gray-500">No active threats detected.</p>}
        {launches.slice().reverse().map((launch) => ( // Show newest first
          <div key={launch.id} className="p-2 bg-gray-900/50 border border-cyan-800/30 rounded">
            <div className="grid grid-cols-2 gap-x-2">
              <p><span className="text-sky-300">ID:</span> <span className="text-purple-300">{launch.id.substring(0,8)}</span></p>
              <p className={getStatusColor(launch.status)}><span className="text-sky-300">STS:</span> {launch.status}</p>
              <p><span className="text-sky-300">ORG:</span> <span className="text-lime-300">{launch.origin.name}</span></p>
              <p><span className="text-sky-300">DST:</span> <span className="text-orange-300">{launch.destination.name}</span></p>
              <p className="col-span-2"><span className="text-sky-300">PLD:</span> <span className="text-fuchsia-300">{launch.payload}</span></p>
              <p><span className="text-sky-300">ETA:</span> <span className={launch.status === MissileStatus.IMPACTED || launch.status === MissileStatus.INTERCEPTED ? "text-gray-500" : "text-teal-300" }>{launch.status === MissileStatus.IMPACTED || launch.status === MissileStatus.INTERCEPTED ? '---' : `${Math.max(0, launch.etaSeconds).toFixed(1)}s`}</span></p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default MissileFeedPanel;