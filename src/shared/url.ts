export function queryParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name)
}

/** Cambia un parámetro de la URL sin recargar ni añadir entradas al historial. `null` lo quita. */
export function setQueryParam(name: string, value: string | null): void {
  const url = new URL(window.location.href)
  if (value === null) url.searchParams.delete(name)
  else url.searchParams.set(name, value)
  window.history.replaceState(null, '', url)
}
