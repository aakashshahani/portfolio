import { useCallback } from 'react'

const KEY = 'as-portfolio-last-view'

export type ViewName = 'poker' | 'chess' | 'straight'

/** Remembers the last "table" a visitor chose, so we can offer to resume it. */
export function useViewMemory() {
  const get = useCallback((): ViewName | null => {
    try {
      const v = localStorage.getItem(KEY)
      return v === 'poker' || v === 'chess' || v === 'straight' ? v : null
    } catch {
      return null
    }
  }, [])

  const set = useCallback((v: ViewName) => {
    try {
      localStorage.setItem(KEY, v)
    } catch {
      /* ignore */
    }
  }, [])

  return { get, set }
}
