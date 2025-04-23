export const ASSISTANT_TYPES = ['sales', 'personal'] as const;

export type AssistantType = (typeof ASSISTANT_TYPES)[number];
