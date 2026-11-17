// One place that defines how much a registration run must do.
//   merge  : a push to main. Process only the questions that merge changed (cursor..HEAD) plus pilots.
//   digest : scheduled / manual / local / test runs. Also work through the queued backlog.
// Why: a merge must finish quickly for the exams it just added; the backlog is drained by the hourly
// reconciliation. "Not needed in this run" is never the same as "nothing left to do".
//
// Two readers, on purpose:
//   explicitRegistrationMode  - what every library, tool and shell pass uses. It reads ONLY ARCHIVE_REGISTRATION_MODE;
//                               without it the answer is digest, whatever CI event the process happens to run in.
//   inferRegistrationMode     - used by the registration writer alone: it turns the workflow event into a mode once and
//                               hands the result to its children through ARCHIVE_REGISTRATION_MODE.
// Reading GITHUB_EVENT_NAME anywhere else would make unrelated tests and tools change behaviour on a push to main.
export const REGISTRATION_MODE_ENV = 'ARCHIVE_REGISTRATION_MODE';
export const REGISTRATION_MODES = ['merge', 'digest'];

export function explicitRegistrationMode(env = process.env) {
  const explicit = env?.[REGISTRATION_MODE_ENV];
  if (explicit === undefined || explicit === '') return 'digest';
  if (!REGISTRATION_MODES.includes(explicit)) throw Error(`REGISTRATION_MODE_INVALID:${String(explicit).slice(0, 40)}`);
  return explicit;
}

export function inferRegistrationMode(env = process.env) {
  const explicit = env?.[REGISTRATION_MODE_ENV];
  if (explicit !== undefined && explicit !== '') return explicitRegistrationMode(env);
  return env?.GITHUB_EVENT_NAME === 'push' ? 'merge' : 'digest';
}
