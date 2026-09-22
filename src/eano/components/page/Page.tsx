/**
 * @fileoverview Page component - A container wrapper for page content
 * @author EANO Admin Template
 */

import type { ReactNode } from 'react';
import { cn } from '@/eano/lib/utils';

/**
 * Props for the Page component
 */
interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content to be rendered inside the page */
  children?: ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Page Component
 * 
 * A centered container component with responsive padding and max-width constraints.
 * Provides a consistent layout wrapper for page content.
 * 
 * @component
 * @example
 * ```tsx
 * <Page className="custom-class">
 *   <h1>Page Content</h1>
 * </Page>
 * ```
 */
export const Page = ({ children, className, ...props }: PageProps) => {
  return (
    <div className={cn('m-auto max-w-[1680px] space-y-3 p-(--page-padding) relative h-full', className)} {...props}>
      {children}
    </div>
  );
};
