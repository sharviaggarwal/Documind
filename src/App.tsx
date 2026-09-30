import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { HomeView } from './components/home/HomeView';
import { DocumentWorkspace } from './components/workspace/DocumentWorkspace';
import { InsightsView } from './components/insights/InsightsView';
import { DocumentsLibrary } from './components/documents/DocumentsLibrary';
import { SavedView } from './components/saved/SavedView';
import { SettingsView } from './components/settings/SettingsView';
import { UploadModal } from './components/upload/UploadModal';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'documents':
        return <DocumentsLibrary />;
      case 'chat':
        return <DocumentWorkspace />;
      case 'insights':
        return <InsightsView />;
      case 'saved':
        return <SavedView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cream font-sans text-wine">
      {/* Main Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden relative">
          {renderActiveView()}
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
