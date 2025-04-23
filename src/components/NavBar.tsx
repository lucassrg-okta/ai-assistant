'use client';

import React, { useState } from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useUser } from '@auth0/nextjs-auth0';

import PageLink from './PageLink';
import AnchorLink from './AnchorLink';
import Auth0Logo from './Auth0Logo';
import { User, Power } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="nav-container shadow-sm border-b bg-white" data-testid="navbar">
      <Navbar color="light" light expand="md" className="py-3">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <NavbarBrand className="me-4">
              <Auth0Logo />
            </NavbarBrand>
            <Nav className="flex-row gap-4" navbar data-testid="navbar-items">
              <NavItem>
                <PageLink href="/" className="nav-link text-muted" testId="navbar-home" icon={User} tabIndex={0}>
                  Home
                </PageLink>
              </NavItem>
            </Nav>
          </div>

          <Nav className="d-none d-md-flex align-items-center" navbar>
            {!isLoading && !user && (
              <NavItem id="qsLoginBtn">
                <AnchorLink
                  href="/auth/login"
                  className="btn btn-primary"
                  tabIndex={0}
                  testId="navbar-login-desktop"
                  icon={User}>
                  Log in
                </AnchorLink>
              </NavItem>
            )}
            {user && (
              <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop">
                <DropdownToggle nav caret id="profileDropDown">
                  <img
                    src={user.picture ?? ''}
                    alt="Profile"
                    className="nav-user-profile rounded-circle"
                    width={40}
                    height={40}
                    data-testid="navbar-picture-desktop"
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header data-testid="navbar-user-desktop">
                    {user.name}
                  </DropdownItem>
                  <DropdownItem className="dropdown-profile" tag="span">
                    <PageLink href="/profile" icon={User} className="dropdown-item" tabIndex={0} testId="navbar-profile-desktop">
                      Profile
                    </PageLink>
                  </DropdownItem>
                  <DropdownItem id="qsLogoutBtn">
                    <AnchorLink href="/auth/logout" className="dropdown-item" icon={Power} tabIndex={0} testId="navbar-logout-desktop">
                      Log out
                    </AnchorLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
