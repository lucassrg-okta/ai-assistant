'use client';

import React, { PropsWithChildren } from 'react';
import './globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const RootLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <html lang="en">
      <head />
      <body className="flex flex-col min-h-screen bg-black text-white">
        <NavBar />
        <div className="flex-grow container mx-auto px-4 mt-8">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
