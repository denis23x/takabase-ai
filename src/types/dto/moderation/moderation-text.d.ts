/** @format */

export type ModerationTextDto = {
  Body: {
    model: string; // 'text-moderation-stable' | 'text-moderation-latest';
    input: string | string[];
  };
};
