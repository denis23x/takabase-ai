/** @format */

export const querystringSearchSchema: Record<string, any> = {
  $id: 'querystringSearchSchema',
  type: 'object',
  properties: {
    query: {
      type: 'string',
      minLength: 2,
      maxLength: 24
    },
    orderBy: {
      type: 'string',
      enum: ['newest', 'oldest']
    },
    page: {
      type: 'number',
      minimum: 1,
      default: 1
    },
    size: {
      type: 'number',
      minimum: 10,
      default: 10
    }
  },
  required: ['page', 'size']
};
