
import React, { useState } from 'react';
import { GovReportItem, ReportStatus } from '../types';
import { REPORT_STATUS_MAP } from '../constants';
import Panel from './Panel';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';

interface GovReportPanelProps {
  reports: GovReportItem[];
}

const GovReportEntry: React.FC<{ report: GovReportItem }> = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statusColor = REPORT_STATUS_MAP[report.status] || "text-gray-400";

  return (
    <div className="mb-2 bg-gray-900/50 border border-cyan-800/30 rounded">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 text-left flex justify-between items-center hover:bg-cyan-900/30 transition-colors"
      >
        <div>
          <span className={`mr-2 font-bold ${statusColor}`}>[{report.status}]</span>
          <span className="text-fuchsia-400">{report.title}</span>
          <span className="text-xs text-gray-500 ml-2"> ({new Date(report.timestamp).toLocaleDateString()})</span>
        </div>
        {isOpen ? <ChevronUpIcon className="text-cyan-400" /> : <ChevronDownIcon className="text-cyan-400" />}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-cyan-800/30 text-gray-300 text-sm">
          <p>{report.content}</p>
        </div>
      )}
    </div>
  );
};

const GovReportPanel: React.FC<GovReportPanelProps> = ({ reports }) => {
  console.log(`[GovReportPanel] Rendering with reports count: ${reports.length}`, reports);
  return (
    <Panel title="Official Briefings" contentClassName="text-sm">
      {reports.length === 0 && <p className="text-gray-500">No official reports available.</p>}
      {reports.slice().reverse().map((report) => ( // Show newest first
        <GovReportEntry key={report.id} report={report} />
      ))}
    </Panel>
  );
};

export default GovReportPanel;
