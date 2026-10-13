import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'cherry' | 'blush' | 'lavender' | 'paper' | 'neutral' | 'success' | 'warning' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-lg transition-colors tracking-tight select-none';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };

  const variantClasses = {
    brand: 'bg-blush-soft text-cherry border border-cherry/20',
    cherry: 'bg-cherry text-white border border-cherry/30',
    blush: 'bg-blush text-wine border border-blush-deep/60',
    lavender: 'bg-lavender text-wine border border-lavender-deep/60',
    paper: 'bg-paper text-wine border border-cherry/15 shadow-2xs',
    neutral: 'bg-cream text-wine-muted border border-cherry/15',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    purple: 'bg-lavender-soft text-wine border border-lavender/60',
    outline: 'bg-transparent text-wine-muted border border-cherry/25',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
