// Everything outside the repo that can change a render byte: Chrome, fonts, Node, Python and its packages, OS.
// Two results are only comparable (and a cached base result only reusable) when this fingerprint is equal.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {sha256, fileSha, readJson} from './util.mjs';

export function resolveChrome() {
  const env = process.env.GEOMETRY_BROWSER_EXECUTABLE;
  if (env) return env;
  const cands = process.platform === 'win32' ? ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe']
    : process.platform === 'darwin' ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'] : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'];
  return cands.find(c => fs.existsSync(c)) ?? null;
}

function chromeVersion(exe) {
  if (!exe) return 'playwright-channel-chrome(unknown)';
  if (process.platform === 'win32') {
    const r = spawnSync('powershell', ['-NoProfile', '-Command', `(Get-Item -LiteralPath '${exe.replace(/'/g, "''")}').VersionInfo.ProductVersion`], {encoding: 'utf8', windowsHide: true});
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  const r = spawnSync(exe, ['--version'], {encoding: 'utf8', windowsHide: true});
  return (r.stdout || r.stderr || 'unknown').trim();
}

export function environmentFingerprint({depsDir}) {
  const chromeExe = resolveChrome();
  const python = process.env.GEOMETRY_PYTHON || 'python';
  const pv = spawnSync(python, ['--version'], {encoding: 'utf8', windowsHide: true});
  const pyDir = path.join(depsDir, 'python');
  const pyPackages = fs.existsSync(pyDir) ? fs.readdirSync(pyDir).filter(n => /\.dist-info$/.test(n)).sort() : [];
  const nodeDir = path.join(depsDir, 'node_modules');
  const nodePackages = {};
  for (const name of ['playwright', 'playwright-core', 'mathjax-full', 'cindyjs']) {
    try { nodePackages[name] = readJson(path.join(nodeDir, name, 'package.json')).version; } catch { nodePackages[name] = null; }
  }
  const fontFile = path.join(depsDir, 'NotoSansKR.ttf');
  const parts = {
    chrome: chromeVersion(chromeExe),
    chromeExecutable: chromeExe ? path.basename(chromeExe) : null,
    node: process.version,
    python: (pv.stdout || pv.stderr || 'unknown').trim(),
    pythonPackages: pyPackages,
    nodePackages,
    fontNotoSansKR: fs.existsSync(fontFile) ? fileSha(fontFile).slice(0, 16) : 'missing',
    os: `${os.platform()} ${os.release()} ${os.arch()}`
  };
  return {...parts, key: sha256(JSON.stringify(parts)).slice(0, 24)};
}
