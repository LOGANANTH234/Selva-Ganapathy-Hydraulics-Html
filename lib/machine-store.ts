// lib/cache.ts
type CacheStore = { [key: string]: any }

const cache: CacheStore = {}

export function setCache(key: string, value: any) {
  cache[key] = value
}

export function getCache<T = any>(key: string): T | undefined {
  return cache[key]
}

export function clearCache(key: string) {
  delete cache[key]
}
