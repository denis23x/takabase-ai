/** @format */

// prettier-ignore
export const moderationTextSchema: Record<string, any> = {
  $id: 'moderationTextSchema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    model: {
      type: 'string'
    },
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          flagged: {
            type: 'boolean'
          },
          categories: {
            type: 'object',
            properties: {
              'sexual': {
                type: 'boolean'
              },
              'hate': {
                type: 'boolean'
              },
              'harassment': {
                type: 'boolean'
              },
              'self-harm': {
                type: 'boolean'
              },
              'sexual/minors': {
                type: 'boolean'
              },
              'hate/threatening': {
                type: 'boolean'
              },
              'violence/graphic': {
                type: 'boolean'
              },
              'self-harm/intent': {
                type: 'boolean'
              },
              'self-harm/instructions': {
                type: 'boolean'
              },
              'harassment/threatening': {
                type: 'boolean'
              },
              'violence': {
                type: 'boolean'
              }
            }
          },
          category_scores: {
            type: 'object',
            // prettier-ignore
            properties: {
              'sexual': {
                type: 'number'
              },
              'hate': {
                type: 'number'
              },
              'harassment': {
                type: 'number'
              },
              'self-harm': {
                type: 'number'
              },
              'sexual/minors': {
                type: 'number'
              },
              'hate/threatening': {
                type: 'number'
              },
              'violence/graphic': {
                type: 'number'
              },
              'self-harm/intent': {
                type: 'number'
              },
              'self-harm/instructions': {
                type: 'number'
              },
              'harassment/threatening': {
                type: 'number'
              },
              'violence': {
                type: 'number'
              },
            }
          }
        }
      }
    }
  }
};
