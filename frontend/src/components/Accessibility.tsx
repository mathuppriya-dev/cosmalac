import { useEffect, useState } from 'react';

// Skip navigation link for keyboard-only users (WCAG 2.2 AA)
export const SkipLink = () => {
  return (
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-gold focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-rose-gold transition-all duration-300"
    >
      Skip to main content
    </a>
  );
};

// Hook to check for reduced motion media query preferences
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
};

// Focus Trap Component for Modals
interface FocusTrapProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTrap = ({ children, isOpen, onClose }: FocusTrapProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return <>{children}</>;
};
