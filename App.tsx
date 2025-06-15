
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MissileLaunch, Tweet, GovReportItem, MediaItem, ViewMode, MissileStatus } from './types';
import * as SimulationService from './services/simulationService';
import {
  SIMULATION_TICK_RATE_MS, MISSILE_EVENT_INTERVAL_MS,
  TWEET_INTERVAL_MS, REPORT_INTERVAL_MS, MEDIA_INTERVAL_MS
} from './constants';

import Header from './components/Header';
import MapDisplay from './components/MapDisplay';
import MissileFeedPanel from './components/MissileFeedPanel';
import TweetFeedPanel from './components/TweetFeedPanel';
import GovReportPanel from './components/GovReportPanel';
import MediaGridPanel from './components/MediaGridPanel';

const MAX_MISSILES = 35; 
const MAX_TWEETS = 50;
const MAX_REPORTS = 10;
const MAX_MEDIA_ITEMS = 12; 

const FOOTER_HEIGHT_CLASS = "pb-12"; 

const App: React.FC = () => {
  const [missiles, setMissiles] = useState<MissileLaunch[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [reports, setReports] = useState<GovReportItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<string>("SYSTEM ONLINE: AWAITING DATA STREAM...");

  const missileIntervalRef = useRef<number | null>(null);
  const tweetIntervalRef = useRef<number | null>(null);
  const reportIntervalRef = useRef<number | null>(null);
  const mediaIntervalRef = useRef<number | null>(null);
  const simulationTickRef = useRef<number | null>(null);

  // Logging state changes for reports and mediaItems
  useEffect(() => {
    console.log(`[App.tsx] Reports state updated. Count: ${reports.length}`, reports);
  }, [reports]);

  useEffect(() => {
    console.log(`[App.tsx] MediaItems state updated. Count: ${mediaItems.length}`, mediaItems);
  }, [mediaItems]);

  const showConnectionMessage = useCallback((message: string, duration: number = 2000) => {
    setConnectionStatus(message);
    setTimeout(() => {
        // Access isSimulating via the setter to get the most current value if needed,
        // though here we are just setting status text based on its current value at timeout.
        // The currentIsSimulating from setIsSimulating is not strictly necessary here 
        // if we just want to reset to a default message based on the isSimulating state at the time the timeout fires.
        // However, to ensure the message accurately reflects the state if it could rapidly change, this is safer.
        setIsSimulating(currentIsSimulating => { 
            if (currentIsSimulating) setConnectionStatus("LIVE DATA STREAM ACTIVE");
            else setConnectionStatus("SIMULATION PAUSED");
            return currentIsSimulating; 
        });
    }, duration);
  }, []); // Empty dependency array makes this callback stable

  const runSimulationCycle = useCallback(() => {
    setMissiles(prevMissiles =>
      prevMissiles
        .map(SimulationService.updateMissile)
        .filter(m => 
            !(m.status === MissileStatus.IMPACTED || m.status === MissileStatus.INTERCEPTED) || 
            (m.impactTime && Date.now() - m.impactTime < 3000) 
        ) 
        .slice(-MAX_MISSILES) 
    );
  }, []); // Empty dependency array makes this callback stable

  const addNewMissile = useCallback(() => {
    setMissiles(prevMissiles => {
      if (prevMissiles.length < MAX_MISSILES) {
        showConnectionMessage("NEW THREAT DETECTED :: MISSILE LAUNCH", 1500);
        return [SimulationService.generateMissileLaunch(), ...prevMissiles].slice(0, MAX_MISSILES);
      }
      return prevMissiles; // No change if max missiles reached
    });
  }, [showConnectionMessage]); // Depends only on stable showConnectionMessage

  const addNewTweet = useCallback(() => {
    setTweets(prev => [SimulationService.generateTweet(), ...prev].slice(0, MAX_TWEETS));
    // Optionally: showConnectionMessage for tweets if desired, and add showConnectionMessage to deps.
    // showConnectionMessage("COMMS INTERCEPT :: INTEL STREAM UPDATE", 1000);
  }, []); // Stable if showConnectionMessage is not used, or add it as dependency if used.

  const addNewReport = useCallback(() => {
    const newReport = SimulationService.generateGovReport();
    console.log('[App.tsx] addNewReport: Generated new report:', newReport);
    setReports(prev => {
      const updated = [newReport, ...prev].slice(0, MAX_REPORTS);
      console.log(`[App.tsx] addNewReport: setReports. Prev length: ${prev.length}, New length: ${updated.length}`);
      return updated;
    });
    showConnectionMessage("HIGH PRIORITY TRANSMISSION :: OFFICIAL BRIEFING RECEIVED", 2000);
  }, [showConnectionMessage]); // Depends only on stable showConnectionMessage

  const addNewMediaItem = useCallback(() => {
    const newItem = SimulationService.generateMediaItem();
    console.log('[App.tsx] addNewMediaItem: Generated new item:', newItem);
    setMediaItems(prev => {
      const updated = [newItem, ...prev].slice(0, MAX_MEDIA_ITEMS);
      console.log(`[App.tsx] addNewMediaItem: setMediaItems. Prev length: ${prev.length}, New length: ${updated.length}`);
      return updated;
    });
     showConnectionMessage("VISUAL INTEL PACKET RECEIVED", 1500);
  }, [showConnectionMessage]); // Depends only on stable showConnectionMessage

  useEffect(() => {
    if (isSimulating) {
      console.log("[App.tsx] SIMULATION STARTING: Setting up intervals.");
      setConnectionStatus("LIVE DATA STREAM ACTIVE");
      simulationTickRef.current = window.setInterval(runSimulationCycle, SIMULATION_TICK_RATE_MS);
      missileIntervalRef.current = window.setInterval(addNewMissile, MISSILE_EVENT_INTERVAL_MS);
      tweetIntervalRef.current = window.setInterval(addNewTweet, TWEET_INTERVAL_MS);
      
      console.log(`[App.tsx] Setting report interval (${REPORT_INTERVAL_MS}ms)`);
      reportIntervalRef.current = window.setInterval(() => {
        console.log("[App.tsx] Interval: Firing addNewReport.");
        addNewReport();
      }, REPORT_INTERVAL_MS);
      
      console.log(`[App.tsx] Setting media item interval (${MEDIA_INTERVAL_MS}ms)`);
      mediaIntervalRef.current = window.setInterval(() => {
        console.log("[App.tsx] Interval: Firing addNewMediaItem.");
        addNewMediaItem();
      }, MEDIA_INTERVAL_MS);

    } else {
      console.log("[App.tsx] SIMULATION PAUSED: Clearing intervals.");
      setConnectionStatus("SIMULATION PAUSED");
      if (simulationTickRef.current) clearInterval(simulationTickRef.current);
      if (missileIntervalRef.current) clearInterval(missileIntervalRef.current);
      if (tweetIntervalRef.current) clearInterval(tweetIntervalRef.current);
      if (reportIntervalRef.current) {
        console.log("[App.tsx] Clearing report interval.");
        clearInterval(reportIntervalRef.current);
      }
      if (mediaIntervalRef.current) {
        console.log("[App.tsx] Clearing media item interval.");
        clearInterval(mediaIntervalRef.current);
      }
    }

    // Cleanup function for the useEffect
    return () => {
      console.log("[App.tsx] Cleanup from isSimulating effect: Clearing all intervals.");
      if (simulationTickRef.current) clearInterval(simulationTickRef.current);
      if (missileIntervalRef.current) clearInterval(missileIntervalRef.current);
      if (tweetIntervalRef.current) clearInterval(tweetIntervalRef.current);
      if (reportIntervalRef.current) clearInterval(reportIntervalRef.current);
      if (mediaIntervalRef.current) clearInterval(mediaIntervalRef.current);
    };
  }, [isSimulating, runSimulationCycle, addNewMissile, addNewTweet, addNewReport, addNewMediaItem]);


  const renderDashboardView = () => (
    <div className={`grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-4 gap-2 p-2 h-[calc(100vh-80px)] ${FOOTER_HEIGHT_CLASS}`}>
        <div className="lg:col-span-2 lg:row-span-4 min-h-[400px] lg:min-h-0">
             <MapDisplay missiles={missiles} className="rounded-md overflow-hidden border border-cyan-700/50 shadow-xl shadow-cyan-900/50"/>
        </div>
        <div className="min-h-[150px] lg:min-h-0 lg:row-span-1"><MissileFeedPanel launches={missiles} /></div>
        <div className="min-h-[150px] lg:min-h-0 lg:row-span-1"><TweetFeedPanel tweets={tweets} /></div>
        <div className="min-h-[150px] lg:min-h-0 lg:row-span-1"><GovReportPanel reports={reports} /></div>
        <div className="min-h-[150px] lg:min-h-0 lg:row-span-1"><MediaGridPanel mediaItems={mediaItems} /></div>
    </div>
  );

  const renderMapView = () => (
    <div className={`p-2 h-[calc(100vh-80px)] ${FOOTER_HEIGHT_CLASS}`}>
      <MapDisplay missiles={missiles} className="rounded-md overflow-hidden border border-cyan-700/50 shadow-xl shadow-cyan-900/50"/>
    </div>
  );

  const renderTerminalView = () => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-[calc(100vh-80px)] ${FOOTER_HEIGHT_CLASS}`}>
      <MissileFeedPanel launches={missiles} />
      <TweetFeedPanel tweets={tweets} />
      <div className="md:col-span-2"><GovReportPanel reports={reports} /></div>
    </div>
  );

  return (
    <div className="bg-[#0A0A0A] text-green-400 min-h-screen flex flex-col font-mono relative overflow-hidden">
      <div className="scanline-overlay"></div>
      <Header
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      <main className="flex-grow">
        {currentView === 'dashboard' && renderDashboardView()}
        {currentView === 'map_only' && renderMapView()}
        {currentView === 'terminal_only' && renderTerminalView()}
      </main>
      <footer className="p-2 text-center text-xs border-t border-cyan-700/50 bg-black/80 backdrop-blur-sm fixed bottom-0 w-full z-10">
        <span className="text-cyan-400">STATUS: {connectionStatus}</span> | 
        <span className="text-red-400"> Active Threats: {missiles.filter(m => m.status === MissileStatus.EN_ROUTE || m.status === MissileStatus.LAUNCH_DETECTED).length}</span> | 
        <span className="text-purple-400"> Intel Packets: {tweets.length + reports.length + mediaItems.length}</span>
      </footer>
    </div>
  );
};

export default App;
