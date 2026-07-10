import { useEffect } from 'react'

/**
 * Updates the document title and meta description per view. Google renders JS,
 * so this improves per-view search snippets and the browser tab. (Social OG
 * tags stay static in index.html since crawlers don't run JS for those.)
 */
export function useSeo(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prevDesc = meta?.content
    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }

    return () => {
      document.title = prevTitle
      if (meta && prevDesc !== undefined) meta.content = prevDesc
    }
  }, [title, description])
}
