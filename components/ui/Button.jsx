'use client';

import Link from 'next/link';

export default function Button({ 
  children, 
  variant = 'primary', 
  href, 
  onClick, 
  type = 'button',
  className = '',
  disabled = false,
  fullWidth = false,
  size = 'default' // 'small', 'default', 'large'
}) {
  
  // Variant styles
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 cursor-pointer text-white',
    secondary: 'bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 cursor-pointer',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-500 cursor-pointer',
    danger: 'bg-error-500 hover:bg-error-600 text-white hover:cursor-pointer',
    accent: 'bg-accent-500 hover:bg-accent-600 text-gray-900 font-bold cursor-pointer', // New yellow CTA button
  };

  // Size styles
  const sizes = {
    small: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };
  
  // Combine all styles with rounded-sm
  const allStyles = [
    'rounded-sm font-semibold transition-colors inline-block text-center',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');
  
  // If href is provided, render as Link
  if (href && !disabled) {
    return (
      <Link href={href} className={allStyles}>
        {children}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={allStyles}
    >
      {children}
    </button>
  );
}