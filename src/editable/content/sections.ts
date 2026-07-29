import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

/*
  Which sections get advertised in the UI.

  Routes are owned by src/app/** and are never affected by this file — every
  task page and detail page stays live and reachable. This only controls what
  the navbar, footer, tiles, pickers and cross-links put in front of a visitor.

  To bring a section back into the navigation, remove it from `hiddenNavTasks`.
*/
export const hiddenNavTasks: TaskKey[] = ['profile']

export type BrowsableTask = (typeof SITE_CONFIG.tasks)[number]

/** Enabled sections minus the hidden ones — use this for any nav-style list. */
export function getBrowsableTasks(): BrowsableTask[] {
  return SITE_CONFIG.tasks.filter((task) => task.enabled && !hiddenNavTasks.includes(task.key))
}

/** The section a generic "start browsing" action should land on. */
export function getPrimaryBrowseRoute(fallback = '/search') {
  return getBrowsableTasks()[0]?.route || fallback
}

/** True when a section should stay out of navigation chrome. */
export function isHiddenNavTask(task: TaskKey) {
  return hiddenNavTasks.includes(task)
}
