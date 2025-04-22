'use client';

import React, { Component, ReactNode } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import NavBarItem from './NavBarItem';

interface PageLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  icon?: LucideIcon;
  tabIndex?: number;
  testId?: string;
}

class PageLink extends Component<PageLinkProps> {
  render() {
    const { children, href, className, icon, tabIndex, testId } = this.props;

    return (
      <Link href={href}>
        <NavBarItem
          href={href}
          className={className}
          icon={icon}
          tabIndex={tabIndex}
          testId={testId}
        >
          {children}
        </NavBarItem>
      </Link>
    );
  }
}

export default PageLink;
