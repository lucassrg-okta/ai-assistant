// src/components/Footer.tsx
import React from 'react';

interface FooterProps {
  /** The copy you want to display, e.g. “Secured by Auth0 Auth for GenAI” */
  brandingText?: string;
}

const Footer: React.FC<FooterProps> = ({
  brandingText = 'Protected by Auth0, Powered by Auth for GenAI',
}) => {
  return (
    <footer className="w-full bg-black text-gray-400 py-4 text-center text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <span>{brandingText}</span>
      </div>
    </footer>
  );
};

export default Footer;
