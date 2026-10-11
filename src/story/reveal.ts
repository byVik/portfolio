import type { Directive } from 'vue'

const observer =
  typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        (entries, self) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            entry.target.classList.add('is-in')
            self.unobserve(entry.target)
          }
        },
        { threshold: 0.08 },
      )

/**
 * `v-reveal`: marks the element with `is-in` the first time it enters the
 * viewport. Its children with `data-reveal` appear staggered (see styles.css).
 */
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (observer) observer.observe(el)
    else el.classList.add('is-in')
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
