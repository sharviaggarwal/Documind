import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-wine/30 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Paper Card */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-paper rounded-2xl border border-cherry/20 shadow-paper-lift z-10 overflow-hidden animate-fade-in`}
      >
        {/* Subtle decorative washi tape accent on top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blush via-lavender to-blush opacity-80" />

        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-cherry/10 flex items-start justify-between bg-cream/30">
            <div>
              {title && (
                <h3 className="font-serif text-lg font-bold text-wine tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-wine-muted mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-wine-muted hover:text-wine hover:bg-blush-soft transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
