export const AUDITOR_OUTPUT_SCHEMA = Object.freeze({
  type: 'object',
  additionalProperties: false,
  properties: {
    evidence: {
      type: 'array',
      items: { type: 'object', additionalProperties: true },
    },
    defects: {
      type: 'array',
      items: { type: 'object', additionalProperties: true },
    },
  },
  required: ['evidence', 'defects'],
});
