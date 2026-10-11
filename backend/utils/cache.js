const NodeCache = require('node-cache');

// Standard TTL: 5 minutes (300 seconds), Check period: 60 seconds
const memoryCache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false // Improves performance by avoiding deep object cloning
});

const getCache = (key) => {
  return memoryCache.get(key);
};

const setCache = (key, data, ttlSeconds = 300) => {
  return memoryCache.set(key, data, ttlSeconds);
};

const delCache = (key) => {
  return memoryCache.del(key);
};

// Invalidate caches starting with a specific prefix
const delCachePrefix = (prefix) => {
  const keys = memoryCache.keys();
  const matchedKeys = keys.filter(k => k.startsWith(prefix));
  if (matchedKeys.length > 0) {
    memoryCache.del(matchedKeys);
  }
};

// Clear all caches
const clearAllCache = () => {
  memoryCache.flushAll();
};

module.exports = {
  memoryCache,
  getCache,
  setCache,
  delCache,
  delCachePrefix,
  clearAllCache
};
