/** @format */

export type ModerationOpenAIDto = {
  Body: {
    model: string;
    input: [
      {
        type: string;
        text?: string;
        image_url?: {
          url: string;
        };
      }
    ];
  };
};
