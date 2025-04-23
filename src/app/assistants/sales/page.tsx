'use client';

import React from 'react';
import Chat from '../../../components/Chat';

const SalesAssistantPage: React.FC = () => {
  return (
    <div className="mb-5" data-testid="csr">
      <h1 data-testid="csr-title">Sales Assistant</h1>
      <div data-testid="csr-text">
        <Chat assistant="sales" />
      </div>
    </div>
  );
};

export default SalesAssistantPage;
