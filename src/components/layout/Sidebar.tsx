import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';
import {
  Home,
  BookOpen,
  MessageSquare,
  Sparkles,
  Bookmark,
  Settings,
  Plus,
  ChevronRight,
  BookmarkCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, setIsUploadModalOpen, activeDocument } = useApp();

  const NAV_ITEMS: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'documents', label: 'My Documents', icon: BookOpen },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-paper border-r border-cherry/15 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Top Section */}
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo / Editorial Masthead */}
        <div className="p-5 border-b border-cherry/10">
          <div
            className="cursor-pointer group"
            onClick={() => setActiveView('home')}
          >
            <div className="flex items-center space-x-2">
              <span className="font-serif font-black text-xl tracking-[0.16em] text-cherry uppercase">
                DOCUMIND
              </span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest px-1.5 py-0.5 bg-blush-soft text-cherry rounded border border-cherry/20">
                ✦ Studio
              </span>
            </div>
            <p className="text-[11px] font-serif italic text-wine-muted mt-0.5 tracking-wide">
              An intelligent reading companion
            </p>
          </div>
        </div>

        {/* Quick Upload Action */}
        <div className="p-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-cherry hover:bg-cherry-dark active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-paper hover:shadow-paper-lift transition-all duration-150 cursor-pointer group"
          >
            <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            <span className="tracking-tight">Upload Document</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-blush-soft text-cherry font-semibold border border-cherry/20 shadow-2xs'
                    : 'text-wine-muted hover:text-wine hover:bg-cream/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cherry' : 'text-wine-muted/70 group-hover:text-cherry'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="text-cherry text-xs">✦</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Document Card in Sidebar */}
        {activeDocument && (
          <div className="mt-auto mx-3 mb-3 p-3 bg-cream/70 rounded-xl border border-cherry/15 shadow-2xs">
            <div className="text-[10px] font-mono uppercase tracking-wider text-wine-muted mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <BookmarkCheck className="w-3 h-3 text-cherry" />
                <span>Active Docket</span>
              </span>
              <span className="text-cherry font-bold">Ready</span>
            </div>
            <div
              onClick={() => setActiveView('chat')}
              className="group cursor-pointer flex items-center justify-between"
            >
              <div className="truncate pr-1">
                <p className="text-xs font-semibold text-wine truncate group-hover:text-cherry transition-colors">
                  {activeDocument.name}
                </p>
                <p className="text-[11px] text-wine-muted/80 font-mono mt-0.5">
                  {activeDocument.pageCount} pages • {activeDocument.fileSizeFormatted}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-wine-muted group-hover:text-cherry group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* User Profile at Bottom */}
      <div className="p-3 border-t border-cherry/10 bg-paper">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-cream transition-colors cursor-pointer group">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-blush text-wine font-serif font-bold text-xs flex items-center justify-center border border-cherry/25 shadow-2xs">
                AR
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-paper" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-wine truncate">
                Alex Rivera
              </div>
              <div className="text-[11px] text-wine-muted truncate font-mono">
                alex@documind.ai
              </div>
            </div>
          </div>

          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blush text-cherry border border-cherry/20 shrink-0">
            Reader
          </span>
        </div>
      </div>
    </aside>
  );
};
