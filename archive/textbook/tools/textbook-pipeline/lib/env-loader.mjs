import fs from "node:fs";
import path from "node:path";

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const index = trimmed.indexOf("=");
  if (index <= 0) return null;
  const key = trimmed.slice(0, index).trim();
  let value = trimmed.slice(index + 1).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

export async function loadLocalEnvFiles(files = []) {
  const loaded = [];
  for (const file of files) {
    if (!file || !fs.existsSync(file)) continue;
    const content = await fs.promises.readFile(file, "utf8");
    let count = 0;
    for (const line of content.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      if (process.env[parsed.key]) continue;
      process.env[parsed.key] = parsed.value;
      count += 1;
    }
    loaded.push({ file, count });
  }
  return loaded;
}

export async function loadPipelineEnv({ cwd = process.cwd(), configFile = "" } = {}) {
  const configDir = configFile ? path.dirname(configFile) : "";
  const candidates = [
    path.join(cwd, ".env.local"),
    path.join(cwd, ".env"),
    configDir ? path.join(configDir, ".env.local") : "",
    configDir ? path.join(configDir, ".env") : "",
  ];
  const unique = [...new Set(candidates.filter(Boolean).map((file) => path.resolve(file)))];
  return loadLocalEnvFiles(unique);
}
