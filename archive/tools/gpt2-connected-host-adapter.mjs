/**
 * Adapter factory entrypoint for `gpt2-one-shot-closeout.mjs --adapter-module ...`.
 * Host module is injected by an authorized connector host. This module does not
 * possess ChatGPT API credentials and cannot operate without real host tools.
 */
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createFilesToolTransport } from './gpt2-files-tool-transport.mjs';
import { createGitHubCasLedger } from './gpt2-github-cas-ledger.mjs';
import { createCoordinatedAdapter } from './gpt2-library-coordinated-adapter.mjs';

export async function createAdapter(config = {}) {
  if (!config.hostModule || !path.isAbsolute(config.hostModule))
    throw Error('AUTHORIZED_CONNECTOR_HOST_MODULE_REQUIRED');
  const mod = await import(pathToFileURL(config.hostModule).href);
  if (typeof mod.createHostClients !== 'function') throw Error('CONNECTOR_HOST_CLIENT_FACTORY_REQUIRED');
  const host = await mod.createHostClients(config.hostOptions || {});
  const library = createFilesToolTransport({
    files: host?.files,
    ...(config.hostScratchDirectory ? { scratchDirectory: config.hostScratchDirectory } : {}),
  });
  const ledger = createGitHubCasLedger({
    github: host?.github,
    repository: config.githubRepository,
    branch: config.githubBranch,
  });
  return createCoordinatedAdapter({
    library, ledger,
    campaignId: config.campaignId,
    stream: config.stream,
    examUid: config.examUid,
  });
}