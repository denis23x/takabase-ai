/** @format */

export const moderationImageSchema: Record<string, any> = {
  $id: 'moderationImageSchema',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      className: {
        type: 'string'
      },
      probability: {
        type: 'number'
      }
    }
  }
};
