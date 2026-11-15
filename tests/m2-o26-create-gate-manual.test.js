// Regression of the original CREATE judgment; current source release is
// checked by the registration projection and changed-UID Consumer gates.
const { runHistoricalCreateGates } = require('./helpers/historical-create-gates.cjs');
runHistoricalCreateGates('m2-o26-create-gate-manual');
