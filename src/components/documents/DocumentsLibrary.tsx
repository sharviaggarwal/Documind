import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  FileText,
  Search,
  Upload,
  MessageSquare,
  Sparkles,
  Trash2,
  Clock,
  Layers,
  LayoutGrid,
  List,
  BookmarkCheck,
} from 'lucide-react';
import { Document } from '../../types';

export const DocumentsLibrary: React.FC = () => {
  const {
    documents,
    selectDocumentAndOpen,
    deleteDoc,
    setIsUploadModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', ...Array.from(new Set(documents.map((d) => d.category || 'General')))];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="h-full overflow-y-auto bg-subtle-grid p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cherry/12">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cherry font-bold">
                Archival Catalog
              </span>
              <span className="text-cherry text-xs">✦</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine tracking-tight mt-0.5">
              Document Archive
            </h2>
            <p className="text-xs text-wine-muted italic mt-0.5">
              Browse, filter, and launch reading notebooks across your indexed volumes
            </p>
          </div>

          <Button
            variant="primary"
            icon={<Upload className="w-3.5 h-3.5" />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Volume
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-paper p-3 rounded-2xl border border-cherry/20 shadow-paper">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-wine-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or topic..."
              className="w-full pl-9 pr-3 py-1.5 bg-cream/80 border border-cherry/20 rounded-xl text-xs text-wine placeholder:text-wine-muted/60 focus:outline-none focus:border-cherry font-sans"
            />
          </div>

          {/* Category Tabs & View Switcher */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-2">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs capitalize px-3 py-1 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blush text-wine font-bold border border-cherry/20'
                      : 'text-wine-muted hover:text-wine hover:bg-cream'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-cherry/15 mx-1 hidden sm:block" />

            <div className="flex items-center space-x-1 border border-cherry/20 rounded-xl p-0.5 bg-cream/40">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-paper text-cherry shadow-2xs' : 'text-wine-muted hover:text-wine'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-paper text-cherry shadow-2xs' : 'text-wine-muted hover:text-wine'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredDocs.length === 0 ? (
          <div className="bg-paper rounded-3xl border border-cherry/20 p-12 text-center shadow-paper">
            <FileText className="w-10 h-10 text-cherry/60 mx-auto mb-3" />
            <h4 className="font-serif text-base font-bold text-wine">No matching volumes</h4>
            <p className="text-xs text-wine-muted mt-1 mb-4 font-sans">
              Try adjusting your search criteria or index a new document into your library.
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc, idx) => (
              <div
                key={doc.id}
                className="bg-paper rounded-3xl border border-cherry/20 p-5 hover:border-cherry/50 hover:shadow-paper-lift transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Washi tape header */}
                <div
                  className={`absolute top-0 inset-x-8 h-1 ${
                    idx % 2 === 0 ? 'bg-blush' : 'bg-lavender'
                  } opacity-90 rounded-b-sm`}
                />

                <div>
                  <div className="flex items-start justify-between mb-3.5 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-blush-soft text-cherry flex items-center justify-center border border-cherry/20 shadow-2xs group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <Badge variant="cherry" size="sm" className="font-mono text-[9px] uppercase">
                      <BookmarkCheck className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-wine line-clamp-1 mb-1.5 group-hover:text-cherry transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-wine-muted line-clamp-2 leading-relaxed mb-4 font-sans">
                    {doc.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-cherry/10">
                  <div className="flex items-center justify-between text-[11px] text-wine-muted font-mono">
                    <div className="flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-cherry" />
                      <span>{doc.pageCount} pages</span>
                      <span>•</span>
                      <span>{doc.fileSizeFormatted}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{doc.lastOpened}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center space-x-1.5 flex-1">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 text-xs"
                        icon={<MessageSquare className="w-3.5 h-3.5" />}
                        onClick={() => selectDocumentAndOpen(doc, 'chat')}
                      >
                        Read
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="px-2.5 text-xs"
                        icon={<Sparkles className="w-3.5 h-3.5 text-cherry" />}
                        onClick={() => selectDocumentAndOpen(doc, 'insights')}
                        title="View Insights"
                      />
                    </div>
                    <button
                      onClick={() => deleteDoc(doc.id)}
                      className="p-2 rounded-xl text-wine-muted hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Archive document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-paper rounded-3xl border border-cherry/20 overflow-hidden shadow-paper divide-y divide-cherry/10">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-cream/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center space-x-3.5 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-blush-soft text-cherry flex items-center justify-center shrink-0 border border-cherry/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-serif text-sm font-bold text-wine truncate">{doc.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-wine-muted font-mono mt-0.5">
                      <span>{doc.pageCount} pages</span>
                      <span>•</span>
                      <span>{doc.fileSizeFormatted}</span>
                      <span>•</span>
                      <span>Opened {doc.lastOpened}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<MessageSquare className="w-3.5 h-3.5 text-cherry" />}
                    onClick={() => selectDocumentAndOpen(doc, 'chat')}
                  >
                    Read
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Sparkles className="w-3.5 h-3.5 text-cherry" />}
                    onClick={() => selectDocumentAndOpen(doc, 'insights')}
                  >
                    Insights
                  </Button>
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    className="p-2 rounded-lg text-wine-muted hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
