import fs from "fs";
import path from "path";
import { createHash } from "crypto";

export type MediaAssetKind = "image" | "video" | "other";

export type MediaAsset = {
  id: string;
  hash: string;
  src: string;
  name: string;
  size: number;
  kind: MediaAssetKind;
  createdAt: string;
  usedBy: string[];
};

export type MediaIndex = {
  version: 1;
  byHash: Record<string, MediaAsset>;
};

const INDEX_PATH = path.join(process.cwd(), "data", "media-index.json");

function emptyIndex(): MediaIndex {
  return { version: 1, byHash: {} };
}

export function hashBuffer(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function shortHash(hash: string): string {
  return hash.slice(0, 8);
}

export function readMediaIndex(): MediaIndex {
  try {
    if (!fs.existsSync(INDEX_PATH)) return emptyIndex();
    const raw = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8")) as MediaIndex;
    if (!raw || raw.version !== 1 || typeof raw.byHash !== "object" || !raw.byHash) {
      return emptyIndex();
    }
    return raw;
  } catch {
    return emptyIndex();
  }
}

export function writeMediaIndex(index: MediaIndex) {
  const dir = path.dirname(INDEX_PATH);
  fs.mkdirSync(dir, { recursive: true });
  const tempPath = `${INDEX_PATH}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(index, null, 2)}\n`, "utf-8");
  fs.renameSync(tempPath, INDEX_PATH);
}

export function findAssetByHash(hash: string): MediaAsset | null {
  const index = readMediaIndex();
  return index.byHash[hash] || null;
}

export function findAssetBySrc(src: string): MediaAsset | null {
  const index = readMediaIndex();
  const normalized = src.split("?")[0];
  for (const asset of Object.values(index.byHash)) {
    if (asset.src === normalized) return asset;
  }
  return null;
}

export function upsertMediaAsset(asset: MediaAsset) {
  const index = readMediaIndex();
  index.byHash[asset.hash] = {
    ...asset,
    usedBy: [...new Set(asset.usedBy)].sort(),
  };
  writeMediaIndex(index);
  return index.byHash[asset.hash];
}

export function removeAssetFromIndex(src: string) {
  const index = readMediaIndex();
  const normalized = src.split("?")[0];
  let removed: MediaAsset | null = null;
  for (const [hash, asset] of Object.entries(index.byHash)) {
    if (asset.src === normalized) {
      removed = asset;
      delete index.byHash[hash];
      break;
    }
  }
  if (removed) writeMediaIndex(index);
  return removed;
}

/** Replaces all usages for a given owner key (e.g. tour:slug). */
export function syncMediaUsage(ownerKey: string, srcs: string[]) {
  const index = readMediaIndex();
  const wanted = new Set(
    srcs
      .map((src) => src.split("?")[0])
      .filter((src) => src.startsWith("/media/"))
  );

  let changed = false;
  for (const asset of Object.values(index.byHash)) {
    const has = asset.usedBy.includes(ownerKey);
    const should = wanted.has(asset.src);
    if (should && !has) {
      asset.usedBy = [...asset.usedBy, ownerKey].sort();
      changed = true;
    } else if (!should && has) {
      asset.usedBy = asset.usedBy.filter((key) => key !== ownerKey);
      changed = true;
    }
  }

  if (changed) writeMediaIndex(index);
}

export function tourOwnerKey(slug: string) {
  return `tour:${slug}`;
}

export function ensureAssetRegistered(params: {
  hash: string;
  src: string;
  name: string;
  size: number;
  kind: MediaAssetKind;
}) {
  const existing = findAssetByHash(params.hash);
  if (existing) {
    return { asset: existing, created: false as const };
  }

  const asset: MediaAsset = {
    id: shortHash(params.hash),
    hash: params.hash,
    src: params.src,
    name: params.name,
    size: params.size,
    kind: params.kind,
    createdAt: new Date().toISOString(),
    usedBy: [],
  };
  upsertMediaAsset(asset);
  return { asset, created: true as const };
}

/** Updates src/name for one asset (rename file). */
export function repointAssetSrc(oldSrc: string, newSrc: string, newName?: string) {
  const index = readMediaIndex();
  const normalized = oldSrc.split("?")[0];
  const nextSrc = newSrc.split("?")[0];
  let updated: MediaAsset | null = null;
  for (const asset of Object.values(index.byHash)) {
    if (asset.src === normalized) {
      asset.src = nextSrc;
      if (newName) asset.name = newName;
      updated = asset;
      break;
    }
  }
  if (updated) writeMediaIndex(index);
  return updated;
}

/** Updates all assets whose src starts with oldPrefix (folder rename). */
export function repointAssetsUnderPrefix(oldPrefix: string, newPrefix: string) {
  const index = readMediaIndex();
  const from = oldPrefix.endsWith("/") ? oldPrefix : `${oldPrefix}/`;
  const to = newPrefix.endsWith("/") ? newPrefix : `${newPrefix}/`;
  let count = 0;
  for (const asset of Object.values(index.byHash)) {
    if (asset.src === oldPrefix || asset.src.startsWith(from)) {
      asset.src = asset.src === oldPrefix ? newPrefix : `${to}${asset.src.slice(from.length)}`;
      asset.name = asset.src.split("/").pop() || asset.name;
      count += 1;
    }
  }
  if (count > 0) writeMediaIndex(index);
  return count;
}
