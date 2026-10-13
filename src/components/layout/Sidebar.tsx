import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  MessageSquare,
  FileText,
  Trash2,
  LogOut,
  Upload,
  Sparkles,
  Clock,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeDocument,
    setIsUploadModalOpen,
    currentUser,
    logout,
    chatSessions,
    currentSessionId,
    startNewChat,
    loadChatSession,
    deleteChatSession,
    documents,
    setActiveDocument,
  } = useApp();

  return (
    <aside className="w-72 h-full bg-paper border-r border-cherry/15 flex flex-col justify-between shrink-0 select-none z-20 font-sans">
      {/* Top Header & Actions */}
      <div className="flex flex-col h-full min-h-0">
        {/* Brand Masthead */}
        <div className="p-4 border-b border-cherry/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-black text-xl tracking-[0.16em] text-cherry uppercase">
                DOCUMIND
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 bg-blush-soft text-cherry rounded border border-cherry/20">
                AI Q&A
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-cherry/70" />
          </div>
          <p className="text-[11px] font-serif italic text-wine-muted mt-0.5 tracking-wide">
            Upload document & ask anything
          </p>
        </div>

        {/* Action Buttons: New Chat & Upload Document */}
        <div className="p-3 space-y-2 border-b border-cherry/10">
          <button
            type="button"
            onClick={startNewChat}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-cherry hover:bg-cherry-dark active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-paper hover:shadow-paper-lift transition-all duration-150 cursor-pointer group"
          >
            <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            <span className="tracking-tight">New Conversation</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-cream hover:bg-blush-soft text-wine hover:text-cherry rounded-xl text-xs font-semibold border border-cherry/20 transition-all cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-cherry" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Active Document Section */}
        {activeDocument ? (
          <div className="p-3 border-b border-cherry/10 bg-cream/40">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-wine-muted mb-1.5">
              <span className="flex items-center space-x-1 font-bold text-cherry">
                <FileText className="w-3 h-3" />
                <span>Active Document</span>
              </span>
              {documents.length > 1 && (
                <span className="text-[10px] text-wine-muted">
                  {documents.length} docs
                </span>
              )}
            </div>

            <div className="p-2.5 bg-paper rounded-xl border border-cherry/15 flex items-center justify-between shadow-2xs">
              <div className="truncate mr-2">
                <div className="font-serif font-bold text-xs text-wine truncate">
                  {activeDocument.name}
                </div>
                <div className="text-[10px] font-mono text-wine-muted">
                  {activeDocument.pageCount} pages • {activeDocument.version || 'Indexed'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="text-[11px] font-serif text-cherry hover:underline shrink-0 cursor-pointer"
                title="Change or upload document"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 border-b border-cherry/10 bg-cream/30">
            <div
              onClick={() => setIsUploadModalOpen(true)}
              className="p-3 bg-paper rounded-xl border border-dashed border-cherry/30 hover:border-cherry text-center cursor-pointer transition-colors"
            >
              <FileText className="w-5 h-5 text-cherry/60 mx-auto mb-1" />
              <div className="text-xs font-serif font-bold text-wine">No document selected</div>
              <div className="text-[10px] text-wine-muted mt-0.5">Click to upload a PDF</div>
            </div>
          </div>
        )}

        {/* Chat History Section */}
        <div className="flex-1 flex flex-col min-h-0 p-3 overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold tracking-wider text-wine-muted mb-2 px-1">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cherry" />
              <span>Chat History</span>
            </span>
            <span className="text-[10px] text-cherry font-bold">
              {chatSessions.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {chatSessions.length === 0 ? (
              <div className="py-8 text-center text-xs text-wine-muted italic font-serif">
                <MessageSquare className="w-6 h-6 text-cherry/20 mx-auto mb-2" />
                No conversation history yet.
                <p className="text-[10px] font-sans not-italic mt-1 text-wine-muted/70">
                  Ask questions to save chats here.
                </p>
              </div>
            ) : (
              chatSessions.map((session) => {
                const isActive = session.id === currentSessionId;
                return (
                  <div
                    key={session.id}
                    onClick={() => loadChatSession(session.id)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-blush-soft text-cherry border-cherry/30 font-semibold shadow-2xs'
                        : 'bg-paper hover:bg-cream/70 text-wine border-cherry/10 hover:border-cherry/25'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate mr-2">
                      <MessageSquare
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-cherry' : 'text-wine-muted group-hover:text-cherry'
                        }`}
                      />
                      <div className="truncate text-left">
                        <div className="truncate font-serif leading-tight">
                          {session.title}
                        </div>
                        <div className="text-[10px] font-mono text-wine-muted truncate mt-0.5">
                          {session.documentName}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-wine-muted hover:text-red-700 hover:bg-red-50 rounded transition-all cursor-pointer shrink-0"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User Section & Sign Out at Bottom */}
      <div className="p-3 border-t border-cherry/15 bg-cream/50">
        <div className="flex items-center justify-between p-2 bg-paper rounded-xl border border-cherry/15 shadow-2xs">
          <div className="truncate mr-2">
            <div className="text-xs font-serif font-bold text-wine truncate">
              {currentUser?.email || 'Guest Reader'}
            </div>
            <div className="text-[10px] font-mono text-wine-muted">
              {currentUser?.isGuest ? 'Guest Session' : 'Supabase Auth'}
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-wine-muted hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
