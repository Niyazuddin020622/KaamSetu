// ==========================================
// KaamSetu High-Performance Browser Cache Engine (SWR)
// Instant 0ms Load Time + Background Revalidation
// ==========================================

const MEMORY_CACHE = new Map();
const CACHE_PREFIX = 'kaamsetu_swr_';
const DEFAULT_TTL_SECONDS = 300; // 5 minutes default

export const CacheEngine = {
  /**
   * Read from In-Memory or localStorage
   * @param {string} key 
   * @param {boolean} allowStale 
   */
  get(key, allowStale = false) {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const now = Date.now();

    // 1. Check Level-1 In-Memory Cache
    if (MEMORY_CACHE.has(fullKey)) {
      const entry = MEMORY_CACHE.get(fullKey);
      if (entry && (allowStale || entry.expiry > now)) {
        return entry.data;
      }
    }

    // 2. Check Level-2 Persistent Browser Storage
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && (allowStale || parsed.expiry > now)) {
        // Hydrate back to memory cache
        MEMORY_CACHE.set(fullKey, parsed);
        return parsed.data;
      }
      if (!allowStale) {
        localStorage.removeItem(fullKey);
      }
    } catch (e) {
      // Storage unavailable or quota exceeded
    }

    return null;
  },

  /**
   * Save data with TTL in both Memory and Persistent Browser Storage
   * @param {string} key 
   * @param {any} data 
   * @param {number} ttlSeconds 
   */
  set(key, data, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const fullKey = `${CACHE_PREFIX}${key}`;
    const expiry = Date.now() + (ttlSeconds * 1000);
    const entry = { data, expiry, timestamp: Date.now() };

    MEMORY_CACHE.set(fullKey, entry);

    try {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (e) {
      // Quota exceeded: clear older keys with prefix
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(CACHE_PREFIX))
          .slice(0, 5)
          .forEach(k => localStorage.removeItem(k));
        localStorage.setItem(fullKey, JSON.stringify(entry));
      } catch (err) {}
    }
  },

  /**
   * Invalidate specific key or prefix
   * @param {string} prefixOrKey 
   */
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

  /**
   * Flush entire cache
   */
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

  /**
   * SWR (Stale-While-Revalidate) Fetcher
   * Immediately returns cached data to caller via callback if present (0ms UI render),
   * then fetches latest from network and updates cache and caller if data changed.
   */
  async swr(key, fetcherFn, { ttlSeconds = 300, onCacheHit = null } = {}) {
    // Check stale or fresh cache
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
      if (cached !== null) {
        // Return cached fallback if network error
        return cached;
      }
      throw err;
    }
  }
};
