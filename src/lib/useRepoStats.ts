import { useEffect, useState } from 'react'
import { profile } from '../data/content'

export interface RepoStat {
  pushedAt: string
  stars: number
}

const KEY = 'gh-repo-stats-v1'

/**
 * One unauthenticated GitHub API call for all repos → last-push time and
 * stars per project. Real, live signals. Cached per session; fails silent
 * (panels simply omit the data), so rate limits can never break the page.
 */
export function useRepoStats() {
  const [stats, setStats] = useState<Record<string, RepoStat> | null>(null)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(KEY)
      if (cached) {
        setStats(JSON.parse(cached))
        return
      }
    } catch {
      /* ignore */
    }
    let cancelled = false
    fetch(
      `https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`,
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(
        (repos: { name: string; pushed_at: string; stargazers_count: number }[]) => {
          if (cancelled) return
          const map: Record<string, RepoStat> = {}
          for (const r of repos)
            map[r.name.toLowerCase()] = {
              pushedAt: r.pushed_at,
              stars: r.stargazers_count,
            }
          try {
            sessionStorage.setItem(KEY, JSON.stringify(map))
          } catch {
            /* ignore */
          }
          setStats(map)
        },
      )
      .catch(() => {
        /* fail silent */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return stats
}

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  const units: [number, string][] = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [604800, 'w'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'min'],
  ]
  for (const [sec, label] of units)
    if (s >= sec) return `${Math.floor(s / sec)}${label} ago`
  return 'just now'
}
