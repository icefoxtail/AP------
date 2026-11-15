// Regression of the original CREATE judgment; current source release is
// checked by the registration projection and changed-UID Consumer gates.
const { runHistoricalCreateGates } = require('./helpers/historical-create-gates.cjs');
runHistoricalCreateGates('m2-temp-create4-o29-create-gate');
