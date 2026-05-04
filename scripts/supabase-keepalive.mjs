#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_ENV_FILES = [
  ".env",
  "artifacts/wedding-app/.env",
  "artifacts/wedding-app/.env.example",
];

function parseEnvFile(path) {
  try {
    const content = readFileSync(resolve(process.cwd(), path), "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eqIndex = line.indexOf("=");
      if (eqIndex < 1) continue;
      const key = line.slice(0, eqIndex).trim();
      if (process.env[key]) continue;
      const value = line.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  } catch {
    // Missing env files are expected in CI when secrets are configured.
  }
}

for (const envFile of DEFAULT_ENV_FILES) {
  parseEnvFile(envFile);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const table = process.env.SUPABASE_KEEPALIVE_TABLE || "wedding_content";
const select = process.env.SUPABASE_KEEPALIVE_SELECT || "id";
const timeoutMs = Number(process.env.SUPABASE_KEEPALIVE_TIMEOUT_MS || "20000");
const maxAttempts = Number(process.env.SUPABASE_KEEPALIVE_MAX_ATTEMPTS || "3");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL/SUPABASE_ANON_KEY or VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY.");
}

const endpoint = new URL(`/rest/v1/${table}`, supabaseUrl);
endpoint.searchParams.set("select", select);
endpoint.searchParams.set("limit", "1");

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

async function pingSupabase(attempt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startedAt = Date.now();
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: "application/json",
        "Cache-Control": "no-store",
      },
      signal: controller.signal,
    });

    const elapsedMs = Date.now() - startedAt;
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}. ${body}`.trim());
    }

    console.log(`Supabase keepalive OK: ${table}.${select} in ${elapsedMs}ms on attempt ${attempt}`);
  } finally {
    clearTimeout(timeout);
  }
}

let lastError;
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    await pingSupabase(attempt);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.warn(`Supabase keepalive attempt ${attempt}/${maxAttempts} failed: ${error.message}`);

    if (attempt < maxAttempts) {
      await sleep(1000 * attempt);
    }
  }
}

throw new Error(`Supabase keepalive failed after ${maxAttempts} attempts: ${lastError?.message || "unknown error"}`);
