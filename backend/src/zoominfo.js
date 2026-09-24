import fs from "fs/promises";
import path from "path";

const WEBSIGHTS_KEY_DEFAULT = "24d3db47bc1789020543";
const AUTH_URL = "https://api.zoominfo.com/authenticate";
const ENRICH_URL = "https://api.zoominfo.com/enrich/ip";
const MATCHES_FILE = "zoominfo-matches.jsonl";
const CACHE_FILE = "zoominfo-ip-cache.json";

let cachedJwt = null;
let cachedJwtExpiresAt = 0;
const enrichQueue = new Map();

function getWebsightsKey() {
  return (
    process.env.ZOOMINFO_WEBSIGHTS_KEY?.trim() || WEBSIGHTS_KEY_DEFAULT
  );
}

function getUsername() {
  return process.env.ZOOMINFO_USERNAME?.trim() || "";
}

function getPassword() {
  return process.env.ZOOMINFO_PASSWORD?.trim() || "";
}

export function isZoomInfoApiConfigured() {
  return Boolean(getUsername() && getPassword());
}

function isPublicIp(ip) {
  const value = String(ip || "").trim();
  if (!value) return false;
  if (value.includes(":")) {
    // Skip local/private IPv6 for enrichment
    const lower = value.toLowerCase();
    return !(
      lower === "::1" ||
      lower.startsWith("fc") ||
      lower.startsWith("fd") ||
      lower.startsWith("fe80")
    );
  }

  const parts = value.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return false;
  const [a, b] = parts;
  if (a === 10 || a === 127) return false;
  if (a === 192 && b === 168) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 169 && b === 254) return false;
  return true;
}

export function getClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  const candidate = forwarded || req.ip || req.socket?.remoteAddress || "";
  return String(candidate).replace(/^::ffff:/, "").trim();
}

export function getZoomInfoIntegrationStatus() {
  const key = getWebsightsKey();
  const apiConfigured = isZoomInfoApiConfigured();

  return {
    product: "ZoomInfo WebSights",
    scriptInstalled: true,
    websightsKeyPreview: key ? `${key.slice(0, 8)}…${key.slice(-4)}` : null,
    trackedSurfaces: [
      "https://bonotech.io",
      "https://www.bonotech.io",
      "https://bonotech-website.web.app",
    ],
    dashboardUrl: "https://app.zoominfo.com/",
    dashboardHint:
      "Open ZoomInfo → WebSights Analytics for the full company visitor list, filters, and CSV export.",
    apiConfigured,
    enrichmentEnabled: apiConfigured,
    enrichmentNote: apiConfigured
      ? "Company enrichment is on. New public visitor IPs are resolved via ZoomInfo /enrich/ip and shown below."
      : "WebSights is collecting company visits in ZoomInfo. To mirror company matches here, add ZOOMINFO_USERNAME and ZOOMINFO_PASSWORD (API access) on the mail API server.",
  };
}

async function authenticate() {
  if (cachedJwt && Date.now() < cachedJwtExpiresAt - 60_000) {
    return cachedJwt;
  }

  const username = getUsername();
  const password = getPassword();
  if (!username || !password) {
    throw new Error("ZoomInfo API credentials are not configured.");
  }

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const payload = await res.json().catch(() => ({}));
  const jwt = payload?.jwt || payload?.data?.jwt || payload?.token;
  if (!res.ok || !jwt) {
    throw new Error(
      payload?.message || payload?.error || `ZoomInfo auth failed (${res.status})`,
    );
  }

  cachedJwt = jwt;
  // ZoomInfo JWTs are typically valid ~1 hour
  cachedJwtExpiresAt = Date.now() + 55 * 60 * 1000;
  return jwt;
}

async function readCache(dataDir) {
  const file = path.join(dataDir, CACHE_FILE);
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    if (error?.code === "ENOENT") return {};
    throw error;
  }
}

async function writeCache(dataDir, cache) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(
    path.join(dataDir, CACHE_FILE),
    `${JSON.stringify(cache, null, 2)}\n`,
    "utf8",
  );
}

function normalizeCompany(data) {
  const company = data?.company || data?.result?.[0]?.data?.company || data;
  if (!company?.name) return null;

  return {
    id: company.id ?? null,
    name: String(company.name).slice(0, 200),
    website: company.website ? String(company.website).slice(0, 200) : undefined,
    industry: Array.isArray(company.industries)
      ? company.industries.slice(0, 3).join(", ")
      : company.industry
        ? String(company.industry).slice(0, 120)
        : undefined,
    employeeCount:
      typeof company.employeeCount === "number"
        ? company.employeeCount
        : undefined,
    revenue:
      typeof company.revenue === "number" ? company.revenue : undefined,
    city: company.city ? String(company.city).slice(0, 80) : undefined,
    state: company.state ? String(company.state).slice(0, 80) : undefined,
    country: company.country ? String(company.country).slice(0, 80) : undefined,
    confidenceScore:
      typeof data?.confidenceScore === "number"
        ? data.confidenceScore
        : typeof company.confidenceScore === "number"
          ? company.confidenceScore
          : undefined,
  };
}

async function enrichIpOnce(dataDir, ip, meta = {}) {
  const cache = await readCache(dataDir);
  if (cache[ip]?.checkedAt) {
    return cache[ip];
  }

  const jwt = await authenticate();
  const res = await fetch(ENRICH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      ipAddress: ip,
      outputFields: [
        "id",
        "name",
        "website",
        "employeeCount",
        "revenue",
        "industries",
        "city",
        "state",
        "country",
        "confidenceScore",
      ],
    }),
  });

  const payload = await res.json().catch(() => ({}));
  const company = normalizeCompany(payload?.data || payload);

  const entry = {
    checkedAt: new Date().toISOString(),
    ip,
    matchType: company ? "company" : payload?.data?.ispInfo ? "isp" : "none",
    company: company || undefined,
    ispName: payload?.data?.ispInfo?.name
      ? String(payload.data.ispInfo.name).slice(0, 160)
      : undefined,
  };

  cache[ip] = entry;
  // Cap cache size
  const keys = Object.keys(cache);
  if (keys.length > 5000) {
    keys
      .sort(
        (a, b) =>
          Date.parse(cache[a].checkedAt || 0) - Date.parse(cache[b].checkedAt || 0),
      )
      .slice(0, keys.length - 4000)
      .forEach((key) => {
        delete cache[key];
      });
  }
  await writeCache(dataDir, cache);

  if (company) {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.appendFile(
      path.join(dataDir, MATCHES_FILE),
      `${JSON.stringify({
        ts: new Date().toISOString(),
        ip,
        sessionId: meta.sessionId,
        path: meta.path,
        ...company,
      })}\n`,
      "utf8",
    );
  }

  return entry;
}

/**
 * Fire-and-forget enrichment for a visitor IP. Dedupes in-flight lookups.
 */
export function maybeEnrichVisitorIp(dataDir, ip, meta = {}) {
  if (!isZoomInfoApiConfigured()) return;
  if (!isPublicIp(ip)) return;

  if (enrichQueue.has(ip)) return;

  const job = enrichIpOnce(dataDir, ip, meta)
    .catch((error) => {
      console.error("[bonotech-mail-api] ZoomInfo enrich failed:", error?.message || error);
    })
    .finally(() => {
      enrichQueue.delete(ip);
    });

  enrichQueue.set(ip, job);
}

export async function buildZoomInfoOverview(dataDir, sinceMs) {
  const status = getZoomInfoIntegrationStatus();
  const file = path.join(dataDir, MATCHES_FILE);
  let raw = "";
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const byCompany = new Map();
  const recent = [];

  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      const ts = Date.parse(row.ts);
      if (!Number.isFinite(ts) || ts < sinceMs) continue;

      const key = row.name || "Unknown";
      const existing = byCompany.get(key) || {
        name: key,
        count: 0,
        website: row.website,
        industry: row.industry,
        country: row.country,
        lastSeen: row.ts,
      };
      existing.count += 1;
      if (Date.parse(row.ts) > Date.parse(existing.lastSeen || 0)) {
        existing.lastSeen = row.ts;
        existing.website = row.website || existing.website;
        existing.industry = row.industry || existing.industry;
        existing.country = row.country || existing.country;
      }
      byCompany.set(key, existing);
      recent.push(row);
    } catch {
      // skip corrupt lines
    }
  }

  recent.sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));

  return {
    ...status,
    matchedCompanies: [...byCompany.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 12),
    recentMatches: recent.slice(0, 20).map((row) => ({
      ts: row.ts,
      name: row.name,
      website: row.website,
      industry: row.industry,
      country: row.country,
      path: row.path,
      employeeCount: row.employeeCount,
    })),
    matchedCompanyCount: byCompany.size,
  };
}
