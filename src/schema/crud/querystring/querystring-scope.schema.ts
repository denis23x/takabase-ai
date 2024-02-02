/** @format */

export const querystringScopeSchema: Record<string, any> = {
  $id: 'querystringScopeSchema',
  type: 'object',
  properties: {
    scope: {
      type: 'array',
      collectionFormat: 'multi',
      items: {
        type: 'string'
      },
      default: [],
      example: ['user', 'post', 'posts', 'category', 'categories']
    }
  }
};
