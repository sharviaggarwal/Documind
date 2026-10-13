import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DocumentWorkspace } from './components/workspace/DocumentWorkspace';
import { UploadModal } from './components/upload/UploadModal';
import { AuthPage } from './components/auth/AuthPage';
import { UploadCloud, FileText } from 'lucide-react';
import { Button } from './components/common/Button';

const MainWorkspace: React.FC = () => {
  const { activeDocument, setIsUploadModalOpen } = useApp();

  if (!activeDocument) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto bg-subtle-grid">
        <div className="w-16 h-16 rounded-2xl bg-blush text-cherry flex items-center justify-center mb-4 shadow-paper border border-cherry/20">
          <UploadCloud className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-wine mb-2">
          Bring your document to begin.
        </h2>
        <p className="text-xs text-wine-muted mb-6 leading-relaxed">
          Upload any PDF document. DocuMind will read it, build the vector and keyword indices, and answer your questions with grounded page citations.
        </p>
        <Button
          variant="primary"
          icon={<FileText className="w-4 h-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Choose PDF to Upload
        </Button>
      </div>
    );
  }

  return <DocumentWorkspace />;
};

const AppContent: React.FC = () => {
  const { currentUser, isAuthChecking, setCurrentUser } = useApp();

  if (isAuthChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cream text-cherry font-serif">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-cherry border-t-transparent animate-spin" />
          <span className="text-xs font-mono uppercase tracking-widest text-wine-muted">
            Connecting to DocuMind...
          </span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage onAuthenticated={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cream font-sans text-wine">
      {/* Sidebar with Chat History & Logout */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden relative">
          <MainWorkspace />
        </main>
      </div>

      {/* Global Upload & Processing Modal */}
      <UploadModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
