export function queryParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name)
}

/** Sets a URL parameter without reloading or adding history entries. `null` removes it. */
export function setQueryParam(name: string, value: string | null): void {
  const url = new URL(window.location.href)
  if (value === null) url.searchParams.delete(name)
  else url.searchParams.set(name, value)
  window.history.replaceState(null, '', url)
}
