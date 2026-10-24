export const PRELOAD_KEY = 'as-preloaded'

/** Reads the once-per-session flag synchronously so other components can
 *  delay their entrances while the preloader is covering the page. */
export function willPreload() {
  try {
    return sessionStorage.getItem(PRELOAD_KEY) !== '1'
  } catch {
    return false
  }
}
