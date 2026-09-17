/* Presentation only. Callers supply the same frozen payload and output options
   as assignment, with submitQr=0 and preRegistered=1 (no assignment writes). */
if (new URLSearchParams(location.search).get('archive2Review') === '1') {
  document.documentElement.classList.add('archive2-paper-review');
  document.addEventListener('DOMContentLoaded', () => document.body.classList.add('screen-fit-mode'));
}
