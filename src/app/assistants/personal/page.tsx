'use client';

import React from 'react';
import Chat from '../../../components/Chat';

const PersonalAssistantPage: React.FC = () => {
  return (
    <div className="mb-5" data-testid="csr">
      <h1 data-testid="csr-title">Personal Assistant</h1>
      <div data-testid="csr-text">
        <Chat assistant="personal" />
      </div>
    </div>
  );
};

export default PersonalAssistantPage;
