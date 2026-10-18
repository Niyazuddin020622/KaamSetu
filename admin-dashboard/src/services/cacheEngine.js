// ==========================================
// KaamSetu Admin Control Center - High-Speed Browser Cache Engine
// Instant 0ms Load Time + Background Revalidation
// ==========================================

const MEMORY_CACHE = new Map();
const CACHE_PREFIX = 'kaamsetu_admin_swr_';
const DEFAULT_TTL_SECONDS = 180; // 3 minutes default for admin

export const AdminCacheEngine = {
  get(key, allowStale = false) {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const now = Date.now();

    if (MEMORY_CACHE.has(fullKey)) {
      const entry = MEMORY_CACHE.get(fullKey);
      if (entry && (allowStale || entry.expiry > now)) {
        return entry.data;
      }
    }

    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && (allowStale || parsed.expiry > now)) {
        MEMORY_CACHE.set(fullKey, parsed);
        return parsed.data;
      }
      if (!allowStale) {
        localStorage.removeItem(fullKey);
      }
    } catch (e) {}

    return null;
  },

  set(key, data, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const expiry = Date.now() + (ttlSeconds * 1000);
    const entry = { data, expiry, timestamp: Date.now() };

    MEMORY_CACHE.set(fullKey, entry);

    try {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (e) {
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(CACHE_PREFIX))
          .slice(0, 5)
          .forEach(k => localStorage.removeItem(k));
        localStorage.setItem(fullKey, JSON.stringify(entry));
      } catch (err) {}
    }
  },

  invalidate(prefixOrKey) {
    const fullKey = `${CACHE_PREFIX}${prefixOrKey}`;
    for (const k of MEMORY_CACHE.keys()) {
      if (k.startsWith(fullKey)) {
        MEMORY_CACHE.delete(k);
      }
    }
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(fullKey)) {
          localStorage.removeItem(k);
        }
      }
    } catch (e) {}
  },

  clear() {
    MEMORY_CACHE.clear();
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  },

  async swr(key, fetcherFn, { ttlSeconds = 180, onCacheHit = null } = {}) {
    const cached = this.get(key, true);
    if (cached !== null && typeof onCacheHit === 'function') {
      onCacheHit(cached);
    }

    try {
      const fresh = await fetcherFn();
      if (fresh) {
        this.set(key, fresh, ttlSeconds);
      }
      return fresh;
    } catch (err) {
      if (cached !== null) return cached;
      throw err;
    }
  }
};
