import type { RecordRegion } from '@/lib/content-types'

export type ExplorerType = 'all' | 'campaigns' | 'events' | 'places'
export type LayerType = 'all' | 'boundaries' | 'historical' | 'records'

export type SearchState = {
  from?: number
  layer: LayerType
  period?: string
  q?: string
  region?: RecordRegion
  to?: number
  type: ExplorerType
  year?: number
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function parseSearchState(
  searchParams: Record<string, string | string[] | undefined>,
): SearchState {
  const from = Number.parseInt(first(searchParams.from) ?? '', 10)
  const to = Number.parseInt(first(searchParams.to) ?? '', 10)
  const year = Number.parseInt(first(searchParams.year) ?? '', 10)
  const layer = first(searchParams.layer)
  const type = first(searchParams.type)
  const region = first(searchParams.region)

  return {
    from: Number.isFinite(from) ? from : undefined,
    layer:
      layer === 'boundaries' || layer === 'historical' || layer === 'records'
        ? layer
        : 'all',
    period: first(searchParams.period) ?? undefined,
    q: first(searchParams.q)?.trim() || undefined,
    region:
      region === 'north' ||
      region === 'central' ||
      region === 'south' ||
      region === 'interregional' ||
      region === 'international'
        ? region
        : undefined,
    to: Number.isFinite(to) ? to : undefined,
    type: type === 'campaigns' || type === 'events' || type === 'places' ? type : 'all',
    year: Number.isFinite(year) ? year : undefined,
  }
}
