import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * App-wide scroll-reveal. Tags a curated set of "block" elements with
 * `.reveal`, then flips them to `.is-visible` as they enter the viewport
 * (staggered via the `--reveal-i` custom property set per row).
 *
 * Works without touching individual pages:
 *  - re-scans on every route change (keyed on pathname)
 *  - a debounced MutationObserver catches async-loaded content
 *    (e.g. news / lists that arrive after fetch)
 *
 * Honours prefers-reduced-motion by doing nothing — the matching CSS
 * keeps `.reveal` fully visible when motion is reduced, so content is
 * never hidden from those users.
 */
const SELECTORS = [
  '.intro > *',
  '.section-rule',
  '.dep-tint',
  '.news-row',
  '.event-card',
  '.stat',
  '.summary .stat-card',
  '.goal-card',
  '.content-block',
  '.related-card',
  '.card',
  '.tx-card',
  '.acc-card',
  '.perm-card',
  '.member-card',
  '.person',
  '.q-card',
  '.report-card',
  '.donate-cta-simple',
  '.kanban-col',
  '.empty-state',
].join(',')

const STAGGER_CAP = 8

export function useReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    const scan = () => {
      const perParent = new Map<Element, number>()
      document.querySelectorAll<HTMLElement>(SELECTORS).forEach(el => {
        // Already shown — leave it alone.
        if (el.classList.contains('is-visible')) return
        el.classList.add('reveal')
        // Assign the stagger index once, the first time we see the element.
        // (Re-observing on StrictMode remount / route change must NOT skip it.)
        if (!el.dataset.revealInit) {
          el.dataset.revealInit = '1'
          const parent = el.parentElement ?? document.body
          const i = perParent.get(parent) ?? 0
          perParent.set(parent, i + 1)
          el.style.setProperty('--reveal-i', String(Math.min(i, STAGGER_CAP)))
        }
        io.observe(el)
      })
    }

    scan()

    // Catch content that mounts after the initial render (async fetches).
    let debounce = 0
    const mo = new MutationObserver(() => {
      window.clearTimeout(debounce)
      debounce = window.setTimeout(scan, 60)
    })
    const main = document.querySelector('.main')
    if (main) mo.observe(main, { childList: true, subtree: true })

    return () => {
      window.clearTimeout(debounce)
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
}
