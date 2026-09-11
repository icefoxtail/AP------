export const AUDITOR_OUTPUT_SCHEMA = Object.freeze({
  type: 'object',
  additionalProperties: false,
  properties: {
    evidence: {
      type: 'array',
      items: { type: 'string' },
    },
    defects: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['evidence', 'defects'],
});
