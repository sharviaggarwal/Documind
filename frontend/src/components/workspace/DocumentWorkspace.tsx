import React, { useState } from 'react';
import { DocInfoSidebar } from './DocInfoSidebar';
import { ChatInterface } from './ChatInterface';
import { SourcesSidebar } from './SourcesSidebar';
import { PanelLeft, PanelRight } from 'lucide-react';

export const DocumentWorkspace: React.FC = () => {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-cream">
      {/* Workspace Sub-header for Mobile / Desktop Panel Toggles */}
      <div className="h-9 px-4 border-b border-cherry/10 bg-paper/70 flex items-center justify-between text-xs text-wine-muted shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              showLeftSidebar
                ? 'text-cherry bg-blush-soft'
                : 'text-wine-muted hover:text-wine hover:bg-cream'
            }`}
            title="Toggle Document Info & Pages Sidebar"
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-serif italic text-wine-muted hidden sm:inline">
            Reading Notebook • Interrogation & Source Verification
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-cherry text-[10px] hidden md:inline">✦ grounded citations</span>
          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              showRightSidebar
                ? 'text-cherry bg-blush-soft'
                : 'text-wine-muted hover:text-wine hover:bg-cream'
            }`}
            title="Toggle Sources & Citations Sidebar"
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3-Section Flex Container */}
      <div className="flex-1 flex overflow-hidden">
        {showLeftSidebar && <DocInfoSidebar />}
        <ChatInterface />
        {showRightSidebar && <SourcesSidebar />}
      </div>
    </div>
  );
};
