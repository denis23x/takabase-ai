/** @format */

export const paramsIdSchema: Record<string, any> = {
  $id: 'paramsIdSchema',
  type: 'object',
  properties: {
    id: {
      type: 'number',
      minimum: 1
    }
  },
  required: ['id']
};
