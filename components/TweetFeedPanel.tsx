
import React, { useEffect, useRef } from 'react';
import { Tweet } from '../types';
import Panel from './Panel';

const usernameColors = ["text-fuchsia-400", "text-purple-400", "text-pink-400", "text-indigo-400"];
const hashtagColors = ["text-sky-400", "text-teal-400", "text-cyan-400"];

interface TweetFeedPanelProps {
  tweets: Tweet[];
}

const TweetFeedPanel: React.FC<TweetFeedPanelProps> = ({ tweets }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tweets]);

  return (
    <Panel title="Comms Channel: Open Intel" contentClassName="text-xs">
      <div ref={scrollRef} className="h-full overflow-y-auto space-y-1 terminal-scrollbar">
        {tweets.length === 0 && <p className="text-gray-500">Awaiting incoming transmissions...</p>}
        {tweets.map((tweet, index) => (
          <div key={tweet.id} className="font-mono">
            <span className={`${usernameColors[index % usernameColors.length]}`}>{tweet.username}:</span>
            <span className="text-green-300"> {tweet.text} </span>
            <span className={`${hashtagColors[index % hashtagColors.length]}`}>{tweet.hashtags.join(' ')}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default TweetFeedPanel;