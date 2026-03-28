import { RoomState } from "@/shared/types";
import { ROOM_TTL_SECONDS } from "@/shared/config";

// ─── In-memory fallback (local dev without any Redis) ────────────────────────

const memoryStore: Map<string, { value: string; expiresAt: number }> = new Map();

function memGet(key: string): string | null {
  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
}

function memSet(key: string, value: string, ttlSeconds: number): void {
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

function memIncr(key: string): number {
  const val = memGet(key);
  const next = (val ? parseInt(val, 10) : 0) + 1;
  memSet(key, String(next), 3600);
  return next;
}

// ─── ioredis client (when REDIS_URL is set) ──────────────────────────────────

// Reuse connection across warm serverless invocations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _ioredis: any = null;

async function getIORedis() {
  if (!process.env.REDIS_URL) return null;
  if (!_ioredis) {
    const { default: IORedis } = await import("ioredis");
    _ioredis = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    });
  }
  return _ioredis;
}

// ─── Vercel KV REST client (when KV_REST_API_URL is set) ─────────────────────

function useVercelKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ─── Unified storage interface ────────────────────────────────────────────────

async function kvGet(key: string): Promise<string | null> {
  if (useVercelKV()) {
    const { kv } = await import("@vercel/kv");
    const val = await kv.get<string>(key);
    return val ?? null;
  }
  const redis = await getIORedis();
  if (redis) {
    const val = await redis.get(key);
    return val ?? null;
  }
  return memGet(key);
}

async function kvSet(key: string, value: string, ttl: number): Promise<void> {
  if (useVercelKV()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(key, value, { ex: ttl });
    return;
  }
  const redis = await getIORedis();
  if (redis) {
    await redis.set(key, value, "EX", ttl);
    return;
  }
  memSet(key, value, ttl);
}

async function kvIncr(key: string): Promise<number> {
  if (useVercelKV()) {
    const { kv } = await import("@vercel/kv");
    return kv.incr(key);
  }
  const redis = await getIORedis();
  if (redis) {
    return redis.incr(key);
  }
  return memIncr(key);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getRoom(roomId: string): Promise<RoomState | null> {
  const raw = await kvGet(`room:${roomId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RoomState;
  } catch {
    return null;
  }
}

export async function setRoom(room: RoomState): Promise<void> {
  room.updatedAt = new Date().toISOString();
  await kvSet(`room:${room.id}`, JSON.stringify(room), ROOM_TTL_SECONDS);
}

export async function getRateLimitCount(key: string): Promise<number> {
  const raw = await kvGet(`ratelimit:${key}`);
  return raw ? parseInt(raw, 10) : 0;
}

export async function incrementRateLimit(key: string): Promise<number> {
  const count = await kvIncr(`ratelimit:${key}`);
  if (count === 1) {
    await kvSet(`ratelimit:${key}`, "1", 3600);
  }
  return count;
}
