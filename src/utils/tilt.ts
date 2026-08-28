// Lightweight 2.5D tilt-on-hover directive-style helper.
// Attach with @mousemove="onTilt" @mouseleave="resetTilt" on a .tilt-card element.
export function onTilt(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  el.style.setProperty('--rx', `${x * 14}deg`)
  el.style.setProperty('--ry', `${-y * 14}deg`)
}

export function resetTilt(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}
