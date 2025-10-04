import React from 'react';

interface ExpenseFlowLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const ExpenseFlowLogo: React.FC<ExpenseFlowLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} rounded-full gradient-primary flex items-center justify-center glow-primary relative overflow-hidden`}>
        {/* Circular E with arrow */}
        <svg 
          className="w-2/3 h-2/3 text-primary-foreground" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          {/* E shape */}
          <path 
            d="M6 4h12v2H8v4h8v2H8v4h10v2H6V4z" 
            fill="currentColor"
          />
          {/* Clockwise arrow */}
          <path 
            d="M16 8l4 4-4 4" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          <path 
            d="M20 12H16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        
        {/* Subtle rotating ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold gradient-primary bg-clip-text text-transparent`}>
            ExpenseFlow
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Next-gen expense management
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseFlowLogo;
