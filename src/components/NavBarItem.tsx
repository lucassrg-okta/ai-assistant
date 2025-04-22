'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

interface NavBarItemProps {
  children: ReactNode;
  href: string;
  className?: string;
  icon?: LucideIcon;
  tabIndex?: number;
  testId?: string;
}

const NavBarItem: React.FC<NavBarItemProps> = ({
  children,
  href,
  className = '',
  icon: Icon,
  tabIndex,
  testId
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const activeClass = 'navbar-item-active';
  const finalClassName = isActive ? `${className} ${activeClass}`.trim() : className;

  return (
    <span className="d-inline-flex align-items-center navbar-item">
      {typeof Icon === 'function' && <Icon className="mr-2 h-4 w-4" />}
      <span
        className={finalClassName}
        tabIndex={tabIndex}
        data-testid={testId}
      >
        {children}
      </span>
    </span>
  );
};

export default NavBarItem;
