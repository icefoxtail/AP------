import { WorkflowEntrypoint } from "cloudflare:workers";

const EXPORT_PATH = "/export";

function requireConfig(env, name) {
  const value = String(env[name] || "").trim();
  if (!value) throw new Error(`Missing required binding or variable: ${name}`);
  return value;
}

async function readApiResult(response, operation) {
  const payload = await response.json();
  if (!response.ok || payload?.success === false) {
    const detail = payload?.errors?.map(item => item?.message).filter(Boolean).join("; ");
    throw new Error(`${operation} failed (${response.status})${detail ? `: ${detail}` : ""}`);
  }
  return payload?.result || {};
}

function backupObjectKey(databaseName, scheduledAt, filename) {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid backup schedule timestamp");
  const iso = date.toISOString().replace(/[:.]/g, "-");
  const extension = String(filename || "backup.sql").endsWith(".gz") ? ".sql.gz" : ".sql";
  return `${databaseName}/daily/${iso.slice(0, 4)}/${iso.slice(5, 7)}/${databaseName}_${iso}${extension}`;
}

export class D1BackupWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const config = await step.do("validate backup configuration", async () => ({
      accountId: requireConfig(this.env, "CLOUDFLARE_ACCOUNT_ID"),
      databaseId: requireConfig(this.env, "D1_DATABASE_ID"),
      databaseName: requireConfig(this.env, "D1_DATABASE_NAME"),
      scheduledAt: event?.timestamp || event?.scheduledTime || new Date().toISOString()
    }));

    const exportUrl = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/d1/database/${config.databaseId}${EXPORT_PATH}`;
    const headers = {
      "Authorization": `Bearer ${requireConfig(this.env, "D1_BACKUP_API_TOKEN")}`,
      "Content-Type": "application/json"
    };

    const bookmark = await step.do("start D1 export", async () => {
      const response = await fetch(exportUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ output_format: "polling" })
      });
      const result = await readApiResult(response, "D1 export start");
      if (!result.at_bookmark) throw new Error("D1 export did not return at_bookmark");
      return result.at_bookmark;
    });

    const dump = await step.do(
      "wait for D1 export",
      { retries: { limit: 20, delay: "15 seconds", backoff: "linear" }, timeout: "10 minutes" },
      async () => {
        const response = await fetch(exportUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ output_format: "polling", current_bookmark: bookmark })
        });
        const result = await readApiResult(response, "D1 export poll");
        if (result.status === "error") throw new Error(result.error || "D1 export failed");
        if (!result.signed_url || !result.filename) throw new Error("D1 export is still in progress");
        return { signedUrl: result.signed_url, filename: result.filename };
      }
    );

    const objectKey = backupObjectKey(config.databaseName, config.scheduledAt, dump.filename);
    const stored = await step.do("download and store D1 export", async () => {
      const response = await fetch(dump.signedUrl);
      if (!response.ok || !response.body) throw new Error(`Backup download failed (${response.status})`);
      const object = await this.env.D1_BACKUP_BUCKET.put(objectKey, response.body, {
        httpMetadata: { contentType: "application/sql" },
        customMetadata: {
          database: config.databaseName,
          databaseId: config.databaseId,
          bookmark,
          scheduledAt: String(config.scheduledAt)
        }
      });
      return { key: objectKey, size: object.size, etag: object.httpEtag };
    });

    await step.do("write backup manifest", async () => {
      const manifestKey = `${objectKey}.json`;
      await this.env.D1_BACKUP_BUCKET.put(manifestKey, JSON.stringify({
        version: 1,
        database: config.databaseName,
        databaseId: config.databaseId,
        bookmark,
        scheduledAt: config.scheduledAt,
        createdAt: new Date().toISOString(),
        object: stored
      }, null, 2), { httpMetadata: { contentType: "application/json" } });
    });

    return stored;
  }
}

