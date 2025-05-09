// src/types/socialproviderstyle.ts
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type SocialProviderStyle = {
  provider: string;
  label: string;
  icon: IconDefinition;
  buttonClass: string;
};
