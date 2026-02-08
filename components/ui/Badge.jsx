export default function Badge({ 
    children, 
    variant = 'default', // 'default', 'featured', 'hot', 'success', 'warning', 'error'
    className = '',
    size = 'default' // 'small', 'default', 'large'
  }) {
    
    // Base badge styles
    const baseStyles = 'inline-flex items-center rounded-full font-semibold';
    
    // Variant styles
    const variants = {
      default: 'bg-gray-100 text-gray-700',
      featured: 'bg-primary-500 text-white',
      hot: 'bg-secondary-500 text-white',
      success: 'bg-success-500 text-white',
      warning: 'bg-warning-500 text-white',
      error: 'bg-error-500 text-white',
      outline: 'bg-transparent border-2 border-primary-500 text-primary-500'
    };
    
    // Size styles
    const sizes = {
      small: 'px-2 py-0.5 text-xs',
      default: 'px-3 py-1 text-sm',
      large: 'px-4 py-1.5 text-base'
    };
    
    // Combine all styles
    const allStyles = [
      baseStyles,
      variants[variant],
      sizes[size],
      className
    ].filter(Boolean).join(' ');
    
    return (
      <span className={allStyles}>
        {children}
      </span>
    );
  }