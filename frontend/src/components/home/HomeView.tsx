import React from 'react';
import { HeroSection } from './HeroSection';
import { FeatureCards } from './FeatureCards';
import { RecentDocuments } from './RecentDocuments';

export const HomeView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-subtle-grid px-6 py-8 sm:px-10">
      <div className="max-w-5xl mx-auto space-y-4">
        <HeroSection />
        <FeatureCards />
        <RecentDocuments />
      </div>
    </div>
  );
};
