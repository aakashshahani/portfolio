import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** Respects the OS "reduce motion" setting so animations stay accessible. */
export function usePrefersReducedMotion(): boolean {
  // Read synchronously on first render: starting at false made reduced-motion
  // visitors get one animated frame (and a Lenis instance built then torn down).
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}
