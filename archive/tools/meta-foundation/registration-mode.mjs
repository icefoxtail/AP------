// One place that decides how much a registration run must do.
//   merge  : a push to main. Process only the questions that merge changed (cursor..HEAD) plus pilots.
//   digest : scheduled / manual / local / test runs. Also work through the queued backlog.
// Why: a merge must finish quickly for the exams it just added; the backlog is drained by the hourly
// reconciliation. "Not needed in this run" is never the same as "nothing left to do".
export const REGISTRATION_MODE_ENV = 'ARCHIVE_REGISTRATION_MODE';
export const REGISTRATION_MODES = ['merge', 'digest'];

export function registrationMode(env = process.env) {
  const explicit = env?.[REGISTRATION_MODE_ENV];
  if (explicit !== undefined && explicit !== '') {
    if (!REGISTRATION_MODES.includes(explicit)) throw Error(`REGISTRATION_MODE_INVALID:${String(explicit).slice(0, 40)}`);
    return explicit;
  }
  return env?.GITHUB_EVENT_NAME === 'push' ? 'merge' : 'digest';
}
