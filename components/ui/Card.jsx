export default function Card({ 
    children, 
    className = '',
    hover = true,
    padding = 'default' // 'none', 'small', 'default', 'large'
  }) {
    
    // Base card styles - no shadows
    const baseStyles = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
    
    // Hover effect - subtle border color change instead of shadow
    const hoverStyles = hover ? 'hover:border-primary-300 transition-colors' : '';
    
    // Padding options
    const paddingStyles = {
      none: '',
      small: 'p-4',
      default: 'p-6',
      large: 'p-8'
    };
    
    // Combine all styles
    const allStyles = [
      baseStyles,
      hoverStyles,
      paddingStyles[padding],
      className
    ].filter(Boolean).join(' ');
    
    return (
      <div className={allStyles}>
        {children}
      </div>
    );
  }