import React from 'react';

/**
 * ButtonProps Interface
 * Extends the standard HTML button attributes with additional custom properties
 * @property variant - The visual style of the button ('primary', 'secondary', 'outline', 'ghost', 'danger')
 * @property size - The size of the button ('sm', 'md', 'lg')
 * @property isLoading - Whether to show a loading spinner
 * @property fullWidth - Whether the button should take up the full width of its container
 * @property leftIcon - Optional icon to display on the left side of the button text
 * @property rightIcon - Optional icon to display on the right side of the button text
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 * A reusable button component with various styles, sizes, and states
 * Supports loading state, icons, and full-width option
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes that apply to all button variants
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Style variants for different button types
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    secondary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100',
    ghost: 'text-green-600 hover:bg-green-50 active:bg-green-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
  };

  // Size variants for different button sizes
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg'
  };

  // Width class for full-width option
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading spinner animation */}
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {/* Left icon with margin */}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {/* Button text/content */}
      {children}
      {/* Right icon with margin */}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;