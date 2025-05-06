import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  icon
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'ios-button-primary';
      case 'secondary':
        return 'ios-button-secondary';
      case 'danger':
        return 'ios-button-danger';
      case 'text':
        return 'ios-button-text';
      default:
        return 'ios-button-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'min-h-8 text-sm px-3';
      case 'medium':
        return 'min-h-11 text-base px-4';
      case 'large':
        return 'min-h-12 text-lg px-6';
      default:
        return 'min-h-11 text-base px-4';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ios-button ${getVariantClass()} ${getSizeClass()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;