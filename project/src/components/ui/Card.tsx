import React from 'react';

/**
 * CardProps Interface
 * Extends standard HTML div attributes with additional card-specific properties
 * @property children - The content to be rendered inside the card
 * @property hoverable - Whether the card should have hover effects
 * @property className - Additional CSS classes to apply to the card
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

/**
 * Card Component
 * A container component that provides a consistent card-like appearance
 * Supports hover effects and custom styling through className prop
 */
const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-4 overflow-hidden
        ${hoverable ? 'transition-transform duration-300 hover:transform hover:translate-y-[-4px] hover:shadow-lg' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeaderProps Interface
 * Props for the CardHeader component
 * @property children - The content to be rendered in the header
 * @property className - Additional CSS classes to apply to the header
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardHeader Component
 * A header section for the card with a bottom border
 * Typically used for card titles or introductory content
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`pb-2 mb-2 border-b ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardTitleProps Interface
 * Props for the CardTitle component
 * @property children - The title text to be displayed
 * @property className - Additional CSS classes to apply to the title
 */
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardTitle Component
 * A heading component for card titles
 * Uses h3 tag with consistent styling
 */
export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3 className={`font-semibold text-lg ${className}`} {...props}>
      {children}
    </h3>
  );
};

/**
 * CardContentProps Interface
 * Props for the CardContent component
 * @property children - The main content to be rendered in the card
 * @property className - Additional CSS classes to apply to the content area
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardContent Component
 * The main content area of the card
 * Provides consistent padding and spacing
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`py-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardFooterProps Interface
 * Props for the CardFooter component
 * @property children - The content to be rendered in the footer
 * @property className - Additional CSS classes to apply to the footer
 */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * CardFooter Component
 * A footer section for the card with a top border
 * Typically used for actions or additional information
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`pt-2 mt-2 border-t ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card };