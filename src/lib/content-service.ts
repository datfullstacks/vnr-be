import { getPayload } from 'payload'

import {
  demoCampaigns,
  demoEvents,
  demoHistoricalOverlays,
  demoPeriods,
  demoPlaces,
  demoQuizzes,
  demoSources,
} from '@/data/demo-content'
import type {
  BoundaryEpochRecord,
  CampaignRecord,
  EventRecord,
  ExplorerSnapshot,
  ExplorerRecord,
  HistoricalAdminUnitRecord,
  OverlayRecord,
  PeriodRecord,
  PlaceRecord,
  QuizRecord,
  SourceRecord,
} from '@/lib/content-types'
import {
  buildHistoricalBoundaryBundle,
  findBoundaryEpochForYear,
} from '@/lib/historical-boundaries'
import { parseSearchState, type SearchState } from '@/lib/search-state'
import { getMongoConnectionString, isDemoFallbackEnabled } from '@/lib/storage-config'
import { toPlainText } from '@/lib/richtext'

let payloadPromise: Promise<Awaited<ReturnType<typeof getPayload>> | null> | null = null
let fallbackSnapshotCache: ExplorerSnapshot | null = null
let explorerSnapshotCache:
  | {
      expiresAt: number
      snapshot: ExplorerSnapshot
    }
  | null = null

const SNAPSHOT_CACHE_TTL_MS = 60_000

async function getPayloadSafe() {
  if (!getMongoConnectionString()) {
    if (isDemoFallbackEnabled()) {
      return null
    }

    throw new Error(
      'Chưa cấu hình connection string MongoDB. Hãy khai báo MONGODB_URI, DATABASE_URL hoặc DATABASE_URI.',
    )
  }

  if (!payloadPromise) {
    payloadPromise = import('@payload-config')
      .then(({ default: config }) => getPayload({ config }))
      .catch((error) => {
        if (isDemoFallbackEnabled()) {
          return null
        }

        throw error
      })
  }

  return payloadPromise
}

function makeSourceId(slug: string) {
  return `source:${slug}`
}

function makePeriodId(slug: string) {
  return `period:${slug}`
}

function makeRecordId(prefix: string, slug: string) {
  return `${prefix}:${slug}`
}

function buildFallbackSnapshot(): ExplorerSnapshot {
  if (fallbackSnapshotCache) {
    return fallbackSnapshotCache
  }

  const sources: SourceRecord[] = demoSources.map((source) => ({
    ...source,
    id: makeSourceId(source.slug),
  }))

  const sourceMap = new Map(sources.map((source) => [source.slug, source]))

  const periods: PeriodRecord[] = demoPeriods.map((period) => ({
    ...period,
    id: makePeriodId(period.slug),
    keyThemes: period.keyThemes.map((theme) => theme.label),
  }))

  const periodMap = new Map(periods.map((period) => [period.slug, period]))

  const { epochs: generatedEpochs, units: generatedUnits } = buildHistoricalBoundaryBundle()

  const adminUnits: HistoricalAdminUnitRecord[] = generatedUnits.map((unit) => ({
    canonicalSlug: unit.canonicalSlug,
    changeSlug: unit.changeSlug,
    changeType: unit.changeType,
    changeYear: unit.changeYear,
    displayColor: unit.displayColor,
    id: makeRecordId('admin-unit', unit.slug),
    labelPoint: {
      latitude: unit.labelPoint.latitude,
      longitude: unit.labelPoint.longitude,
    },
    memberProvinceSlugs: unit.memberProvinceSlugs,
    predecessorCanonicalSlugs: unit.predecessorCanonicalSlugs,
    slug: unit.slug,
    sources: unit.sourceSlugs.map((slug) => sourceMap.get(slug)!).filter(Boolean),
    summary: unit.summary,
    title: unit.title,
    unitType: unit.unitType,
    validFromYear: unit.validFromYear,
    validToYear: unit.validToYear,
  }))

  const adminUnitMap = new Map(adminUnits.map((unit) => [unit.slug, unit]))

  const boundaryEpochs: BoundaryEpochRecord[] = generatedEpochs.map((epoch) => ({
    boundaryFeatures: epoch.boundaryFeatures,
    id: epoch.id,
    labelFeatures: epoch.labelFeatures,
    slug: epoch.slug,
    sources: epoch.sourceSlugs.map((slug) => sourceMap.get(slug)!).filter(Boolean),
    summary: epoch.summary,
    title: epoch.title,
    units: epoch.unitSlugs.map((slug) => adminUnitMap.get(slug)!).filter(Boolean),
    validFromYear: epoch.validFromYear,
    validToYear: epoch.validToYear,
  }))

  const places: PlaceRecord[] = demoPlaces.map((place) => ({
    body: place.body,
    historicalGeometry: place.historicalGeometry,
    id: makeRecordId('place', place.slug),
    modernLocation: place.modernLocation,
    period: periodMap.get(place.period)!,
    region: place.region,
    slug: place.slug,
    sources: place.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
    summary: place.summary,
    title: place.title,
  }))

  const placeMap = new Map(places.map((place) => [place.slug, place]))

  const events: EventRecord[] = demoEvents.map((event) => ({
    content: event.content,
    datePrecision: event.datePrecision,
    displayYear: event.displayYear,
    endDate: event.endDate,
    historicalGeometry: event.historicalGeometry,
    id: makeRecordId('event', event.slug),
    mediaUrls: [],
    modernLocation: event.modernLocation,
    period: periodMap.get(event.period)!,
    places: event.places.map((slug) => placeMap.get(slug)!).filter(Boolean),
    region: event.region,
    slug: event.slug,
    sources: event.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
    startDate: event.startDate,
    summary: event.summary,
    title: event.title,
    topics: event.topics,
  }))

  const eventMap = new Map(events.map((event) => [event.slug, event]))

  const campaigns: CampaignRecord[] = demoCampaigns.map((campaign) => ({
    body: campaign.body,
    datePrecision: campaign.datePrecision,
    displayYear: campaign.displayYear,
    endDate: campaign.endDate,
    historicalGeometry: campaign.historicalGeometry,
    id: makeRecordId('campaign', campaign.slug),
    mediaUrls: [],
    modernLocation: campaign.modernLocation,
    outcome: campaign.outcome,
    period: periodMap.get(campaign.period)!,
    region: campaign.region,
    relatedEvents: campaign.relatedEvents.map((slug) => eventMap.get(slug)!).filter(Boolean),
    relatedPlaces: campaign.relatedPlaces.map((slug) => placeMap.get(slug)!).filter(Boolean),
    slug: campaign.slug,
    sources: campaign.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
    startDate: campaign.startDate,
    summary: campaign.summary,
    title: campaign.title,
  }))

  const campaignMap = new Map(campaigns.map((campaign) => [campaign.slug, campaign]))

  const overlays: OverlayRecord[] = demoHistoricalOverlays.map((overlay) => ({
    ...overlay,
    id: makeRecordId('overlay', overlay.slug),
    period: periodMap.get(overlay.period)!,
    sources: overlay.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
  }))

  const quizzes: QuizRecord[] = demoQuizzes.map((quiz) => ({
    ...quiz,
    id: makeRecordId('quiz', quiz.slug),
    period: periodMap.get(quiz.period)!,
    relatedCampaigns: quiz.relatedCampaigns
      .map((slug) => campaignMap.get(slug)!)
      .filter(Boolean),
    relatedEvents: quiz.relatedEvents.map((slug) => eventMap.get(slug)!).filter(Boolean),
    sources: quiz.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
  }))

  fallbackSnapshotCache = {
    adminUnits,
    boundaryEpochs,
    campaigns,
    events,
    overlays,
    periods,
    places,
    quizzes,
    sources,
  }

  return fallbackSnapshotCache
}

function mapSourceDoc(doc: any): SourceRecord {
  return {
    author: doc.author ?? undefined,
    bibliography: doc.bibliography ?? '',
    id: String(doc.id),
    license: doc.license ?? '',
    publisher: doc.publisher ?? undefined,
    reliability: doc.reliability ?? 'reference',
    slug: doc.slug,
    sourceType: doc.sourceType ?? 'book',
    summary: doc.summary ?? '',
    title: doc.title,
    url: doc.url ?? undefined,
    year: doc.year ?? 0,
  }
}

function mapPeriodDoc(doc: any): PeriodRecord {
  return {
    accentColor: doc.accentColor ?? '#ab2f24',
    endYear: doc.endYear,
    id: String(doc.id),
    keyThemes: Array.isArray(doc.keyThemes) ? doc.keyThemes.map((item: any) => item.label) : [],
    overview: toPlainText(doc.overview),
    slug: doc.slug,
    startYear: doc.startYear,
    summary: doc.summary ?? '',
    title: doc.title,
  }
}

function mapPlaceDoc(
  doc: any,
  periodMap: Map<string, PeriodRecord>,
  sourceMap: Map<string, SourceRecord>,
): PlaceRecord {
  const periodDoc = doc.period && typeof doc.period === 'object' ? doc.period : null
  const period = periodDoc ? periodMap.get(String(periodDoc.id)) : undefined

  return {
    body: toPlainText(doc.body),
    featuredMediaUrl: typeof doc.featuredMedia?.url === 'string' ? doc.featuredMedia.url : undefined,
    historicalGeometry: doc.historicalGeometry ?? undefined,
    id: String(doc.id),
    modernLocation: doc.modernLocation ?? undefined,
    period: period!,
    region: doc.region,
    slug: doc.slug,
    sources: Array.isArray(doc.sources)
      ? doc.sources
          .map((source: any) => sourceMap.get(String(source.id)))
          .filter(Boolean) as SourceRecord[]
      : [],
    summary: doc.summary ?? '',
    title: doc.title,
  }
}

function mapHistoricalAdminUnitDoc(
  doc: any,
  sourceMap: Map<string, SourceRecord>,
): HistoricalAdminUnitRecord {
  return {
    canonicalSlug: doc.canonicalSlug ?? doc.slug,
    changeSlug: doc.changeSlug ?? doc.slug,
    changeType: doc.changeType ?? 'base',
    changeYear: doc.changeYear ?? doc.validFromYear ?? 0,
    displayColor: doc.displayColor ?? '#ab2f24',
    id: String(doc.id),
    labelPoint:
      typeof doc.labelPoint?.longitude === 'number' && typeof doc.labelPoint?.latitude === 'number'
        ? {
            latitude: doc.labelPoint.latitude,
            longitude: doc.labelPoint.longitude,
          }
        : undefined,
    memberProvinceSlugs: Array.isArray(doc.memberProvinceSlugs)
      ? doc.memberProvinceSlugs
          .map((item: any) => item?.slug)
          .filter(Boolean)
      : [],
    predecessorCanonicalSlugs: Array.isArray(doc.predecessorCanonicalSlugs)
      ? doc.predecessorCanonicalSlugs
          .map((item: any) => item?.slug)
          .filter(Boolean)
      : [],
    slug: doc.slug,
    sources: Array.isArray(doc.sources)
      ? doc.sources.map((item: any) => sourceMap.get(String(item.id))).filter(Boolean)
      : [],
    summary: doc.summary ?? '',
    title: doc.title,
    unitType: doc.unitType ?? 'province',
    validFromYear: doc.validFromYear ?? 0,
    validToYear: doc.validToYear ?? 0,
  }
}

function mapBoundaryEpochDoc(
  doc: any,
  adminUnitMap: Map<string, HistoricalAdminUnitRecord>,
  sourceMap: Map<string, SourceRecord>,
): BoundaryEpochRecord {
  return {
    boundaryFeatures: doc.boundaryFeatures ?? { features: [], type: 'FeatureCollection' },
    id: String(doc.id),
    labelFeatures: doc.labelFeatures ?? { features: [], type: 'FeatureCollection' },
    slug: doc.slug,
    sources: Array.isArray(doc.sources)
      ? doc.sources.map((item: any) => sourceMap.get(String(item.id))).filter(Boolean)
      : [],
    summary: doc.summary ?? '',
    title: doc.title,
    units: Array.isArray(doc.units)
      ? doc.units.map((item: any) => adminUnitMap.get(String(item.id))).filter(Boolean)
      : [],
    validFromYear: doc.validFromYear ?? 0,
    validToYear: doc.validToYear ?? 0,
  }
}

async function buildPayloadSnapshot(): Promise<ExplorerSnapshot | null> {
  const payload = await getPayloadSafe()

  if (!payload) {
    return null
  }

  try {
    const where = {
      _status: {
        equals: 'published',
      },
    }

    const [
      sourceDocs,
      periodDocs,
      adminUnitDocs,
      boundaryEpochDocs,
      placeDocs,
      eventDocs,
      campaignDocs,
      overlayDocs,
      quizDocs,
    ] = await Promise.all([
      payload.find({ collection: 'sources', depth: 0, limit: 100, pagination: false, where }),
      payload.find({ collection: 'periods', depth: 0, limit: 100, pagination: false, where }),
      payload.find({
        collection: 'historical-admin-units',
        depth: 1,
        limit: 1000,
        pagination: false,
        where,
      }),
      payload.find({
        collection: 'boundary-epochs',
        depth: 2,
        limit: 100,
        pagination: false,
        where,
      }),
      payload.find({ collection: 'places', depth: 2, limit: 200, pagination: false, where }),
      payload.find({ collection: 'events', depth: 2, limit: 200, pagination: false, where }),
      payload.find({ collection: 'campaigns', depth: 2, limit: 200, pagination: false, where }),
      payload.find({
        collection: 'historical-overlays',
        depth: 1,
        limit: 200,
        pagination: false,
        where,
      }),
      payload.find({ collection: 'quizzes', depth: 2, limit: 100, pagination: false, where }),
    ])

    const sources = sourceDocs.docs.map(mapSourceDoc)
    const sourceMap = new Map(sources.map((source) => [source.id, source]))
    const periods = periodDocs.docs.map(mapPeriodDoc)
    const periodMap = new Map(periods.map((period) => [period.id, period]))

    const adminUnits = adminUnitDocs.docs.map((doc: any) => mapHistoricalAdminUnitDoc(doc, sourceMap))
    const adminUnitMap = new Map(adminUnits.map((unit) => [unit.id, unit]))
    const boundaryEpochs = boundaryEpochDocs.docs.map((doc: any) =>
      mapBoundaryEpochDoc(doc, adminUnitMap, sourceMap),
    )

    const places = placeDocs.docs.map((doc) => mapPlaceDoc(doc, periodMap, sourceMap))
    const placeMap = new Map(places.map((place) => [place.id, place]))

    const events: EventRecord[] = eventDocs.docs.map((doc: any) => ({
      content: toPlainText(doc.content),
      datePrecision: doc.datePrecision,
      displayYear:
        typeof doc.displayYear === 'number'
          ? doc.displayYear
          : new Date(doc.startDate).getUTCFullYear(),
      endDate: doc.endDate ?? undefined,
      historicalGeometry: doc.historicalGeometry ?? undefined,
      id: String(doc.id),
      mediaUrls: Array.isArray(doc.media)
        ? doc.media.map((item: any) => item?.url).filter(Boolean)
        : [],
      modernLocation: doc.modernLocation ?? undefined,
      period: periodMap.get(String(doc.period?.id))!,
      places: Array.isArray(doc.places)
        ? doc.places.map((item: any) => placeMap.get(String(item.id))).filter(Boolean)
        : [],
      region: doc.region,
      slug: doc.slug,
      sources: Array.isArray(doc.sources)
        ? doc.sources.map((item: any) => sourceMap.get(String(item.id))).filter(Boolean)
        : [],
      startDate: doc.startDate,
      summary: doc.summary ?? '',
      title: doc.title,
      topics: Array.isArray(doc.topics) ? doc.topics : [],
    }))

    const eventMap = new Map(events.map((event) => [event.id, event]))

    const campaigns: CampaignRecord[] = campaignDocs.docs.map((doc: any) => ({
      body: toPlainText(doc.body),
      datePrecision: doc.datePrecision,
      displayYear:
        typeof doc.displayYear === 'number'
          ? doc.displayYear
          : new Date(doc.startDate).getUTCFullYear(),
      endDate: doc.endDate ?? undefined,
      historicalGeometry: doc.historicalGeometry ?? undefined,
      id: String(doc.id),
      mediaUrls: Array.isArray(doc.media)
        ? doc.media.map((item: any) => item?.url).filter(Boolean)
        : [],
      modernLocation: doc.modernLocation ?? undefined,
      outcome: doc.outcome ?? '',
      period: periodMap.get(String(doc.period?.id))!,
      region: doc.region,
      relatedEvents: Array.isArray(doc.relatedEvents)
        ? doc.relatedEvents.map((item: any) => eventMap.get(String(item.id))).filter(Boolean)
        : [],
      relatedPlaces: Array.isArray(doc.relatedPlaces)
        ? doc.relatedPlaces.map((item: any) => placeMap.get(String(item.id))).filter(Boolean)
        : [],
      slug: doc.slug,
      sources: Array.isArray(doc.sources)
        ? doc.sources.map((item: any) => sourceMap.get(String(item.id))).filter(Boolean)
        : [],
      startDate: doc.startDate,
      summary: doc.summary ?? '',
      title: doc.title,
    }))

    const overlays: OverlayRecord[] = overlayDocs.docs.map((doc: any) => ({
      color: doc.color ?? '#ab2f24',
      historicalGeometry: doc.historicalGeometry ?? { type: 'Point', coordinates: [105.8, 21.02] },
      id: String(doc.id),
      layerGroup: doc.layerGroup ?? 'historical_overlays',
      layerKind: doc.layerKind,
      opacity: doc.opacity ?? 0.35,
      period: periodMap.get(String(doc.period?.id))!,
      region: doc.region,
      relatedCampaign:
        typeof doc.relatedCampaign === 'object' ? String(doc.relatedCampaign.slug) : undefined,
      relatedEvent: typeof doc.relatedEvent === 'object' ? String(doc.relatedEvent.slug) : undefined,
      slug: doc.slug,
      sources: Array.isArray(doc.sources)
        ? doc.sources.map((item: any) => sourceMap.get(String(item.id))).filter(Boolean)
        : [],
      summary: doc.summary ?? '',
      title: doc.title,
      validFrom: doc.validFrom,
      validTo: doc.validTo ?? undefined,
    }))

    const campaignMap = new Map(campaigns.map((campaign) => [campaign.id, campaign]))

    const quizzes: QuizRecord[] = quizDocs.docs.map((doc: any) => ({
      id: String(doc.id),
      period: periodMap.get(String(doc.period?.id))!,
      questions: Array.isArray(doc.questions) ? doc.questions : [],
      relatedCampaigns: Array.isArray(doc.relatedCampaigns)
        ? doc.relatedCampaigns.map((item: any) => campaignMap.get(String(item.id))).filter(Boolean)
        : [],
      relatedEvents: Array.isArray(doc.relatedEvents)
        ? doc.relatedEvents.map((item: any) => eventMap.get(String(item.id))).filter(Boolean)
        : [],
      slug: doc.slug,
      sources: Array.isArray(doc.sources)
        ? doc.sources.map((item: any) => sourceMap.get(String(item.id))).filter(Boolean)
        : [],
      summary: doc.summary ?? '',
      title: doc.title,
    }))

    return {
      adminUnits,
      boundaryEpochs,
      campaigns,
      events,
      overlays,
      periods,
      places,
      quizzes,
      sources,
    }
  } catch (error) {
    if (isDemoFallbackEnabled()) {
      return null
    }

    throw error
  }
}

async function buildExplorerSnapshot() {
  const payloadSnapshot = await buildPayloadSnapshot()

  if (payloadSnapshot) {
    return payloadSnapshot
  }

  if (isDemoFallbackEnabled()) {
    return buildFallbackSnapshot()
  }

  throw new Error('Không lấy được dữ liệu từ MongoDB và chế độ demo fallback đang tắt.')
}

export async function getExplorerSnapshot() {
  const now = Date.now()

  if (explorerSnapshotCache && explorerSnapshotCache.expiresAt > now) {
    return explorerSnapshotCache.snapshot
  }

  const snapshot = await buildExplorerSnapshot()

  explorerSnapshotCache = {
    expiresAt: now + SNAPSHOT_CACHE_TTL_MS,
    snapshot,
  }

  return snapshot
}

function matchesQuery(record: ExplorerRecord | PeriodRecord, q?: string) {
  if (!q) {
    return true
  }

  const haystack = [
    record.title,
    record.summary,
    'period' in record ? record.period.title : '',
    'body' in record ? record.body : '',
    'content' in record ? record.content : '',
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(q.toLowerCase())
}

function periodMatchesYear(period: PeriodRecord, year: number) {
  return period.startYear <= year && period.endYear >= year
}

function withinYearRange(
  startDate: string | undefined,
  endDate: string | undefined,
  filters: SearchState,
) {
  if (!filters.from && !filters.to) {
    return true
  }

  const startYear = startDate ? new Date(startDate).getUTCFullYear() : undefined
  const resolvedEndYear = endDate ? new Date(endDate).getUTCFullYear() : startYear

  if (!startYear) {
    return true
  }

  if (filters.from && resolvedEndYear && resolvedEndYear < filters.from) {
    return false
  }

  if (filters.to && startYear > filters.to) {
    return false
  }

  return true
}

function withinExactYear(year: number, startDate?: string, endDate?: string) {
  if (!startDate) {
    return false
  }

  const startYear = new Date(startDate).getUTCFullYear()
  const resolvedEndYear = endDate ? new Date(endDate).getUTCFullYear() : startYear

  return startYear <= year && resolvedEndYear >= year
}

function recordMatchesYear(
  displayYear: number | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  filters: SearchState,
) {
  if (typeof filters.year === 'number') {
    if (typeof displayYear === 'number') {
      return displayYear === filters.year
    }

    return withinExactYear(filters.year, startDate, endDate)
  }

  return withinYearRange(startDate, endDate, filters)
}

function resolveActiveYear(snapshot: ExplorerSnapshot, filters: SearchState) {
  if (typeof filters.year === 'number') {
    return filters.year
  }

  if (typeof filters.to === 'number') {
    return filters.to
  }

  if (filters.period) {
    const period = snapshot.periods.find((item) => item.slug === filters.period)

    if (period) {
      return period.endYear
    }
  }

  if (typeof filters.from === 'number') {
    return filters.from
  }

  const maxRecordYear = Math.max(
    0,
    ...snapshot.events.map((event) => event.displayYear),
    ...snapshot.campaigns.map((campaign) => campaign.displayYear),
  )
  const maxBoundaryYear = snapshot.boundaryEpochs.reduce(
    (maxYear, epoch) => Math.max(maxYear, epoch.validToYear),
    0,
  )
  const maxPeriodYear = snapshot.periods.reduce(
    (maxYear, period) => Math.max(maxYear, period.endYear),
    0,
  )

  return maxRecordYear || Math.max(maxBoundaryYear, maxPeriodYear)
}

export function filterSnapshot(snapshot: ExplorerSnapshot, filters: SearchState): ExplorerSnapshot {
  const activeYear = resolveActiveYear(snapshot, filters)
  const activeBoundaryEpoch = findBoundaryEpochForYear(snapshot.boundaryEpochs, activeYear)

  const events = snapshot.events.filter((event) => {
    if (filters.period && event.period.slug !== filters.period) return false
    if (typeof filters.year === 'number' && !periodMatchesYear(event.period, filters.year)) return false
    if (filters.region && event.region !== filters.region) return false
    if (!matchesQuery(event, filters.q)) return false
    return recordMatchesYear(event.displayYear, event.startDate, event.endDate, filters)
  })

  const campaigns = snapshot.campaigns.filter((campaign) => {
    if (filters.period && campaign.period.slug !== filters.period) return false
    if (typeof filters.year === 'number' && !periodMatchesYear(campaign.period, filters.year)) return false
    if (filters.region && campaign.region !== filters.region) return false
    if (!matchesQuery(campaign, filters.q)) return false
    return recordMatchesYear(campaign.displayYear, campaign.startDate, campaign.endDate, filters)
  })

  const places = snapshot.places.filter((place) => {
    if (filters.period && place.period.slug !== filters.period) return false
    if (typeof filters.year === 'number' && !periodMatchesYear(place.period, filters.year)) return false
    if (filters.region && place.region !== filters.region) return false
    return matchesQuery(place, filters.q)
  })

  const overlays = snapshot.overlays.filter((overlay) => {
    if (filters.period && overlay.period.slug !== filters.period) return false
    if (typeof filters.year === 'number' && !periodMatchesYear(overlay.period, filters.year)) return false
    if (filters.region && overlay.region !== filters.region) return false
    if (
      !matchesQuery(overlay.period, filters.q) &&
      !overlay.title.toLowerCase().includes((filters.q ?? '').toLowerCase())
    ) {
      return false
    }

    if (typeof filters.year === 'number') {
      return withinExactYear(filters.year, overlay.validFrom, overlay.validTo)
    }

    return withinYearRange(overlay.validFrom, overlay.validTo, filters)
  })

  return {
    activeBoundaryEpoch,
    activeYear,
    adminUnits: activeBoundaryEpoch?.units ?? [],
    boundaryEpochs: snapshot.boundaryEpochs,
    campaigns,
    events,
    overlays,
    periods: snapshot.periods,
    places,
    quizzes: snapshot.quizzes.filter((quiz) => !filters.period || quiz.period.slug === filters.period),
    sources: snapshot.sources,
  }
}

export async function getExplorerData(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const snapshot = await getExplorerSnapshot()
  const parsedFilters = parseSearchState(searchParams)

  return {
    filters: parsedFilters,
    snapshot: filterSnapshot(snapshot, parsedFilters),
  }
}

export async function getPeriod(slug: string) {
  const snapshot = await getExplorerSnapshot()
  const period = snapshot.periods.find((item) => item.slug === slug)
  const filters: SearchState = { layer: 'all', period: slug, type: 'all' }
  const records = filterSnapshot(snapshot, filters)
  return { period, ...records }
}

export async function getEvent(slug: string) {
  const snapshot = await getExplorerSnapshot()
  return snapshot.events.find((item) => item.slug === slug)
}

export async function getCampaign(slug: string) {
  const snapshot = await getExplorerSnapshot()
  return snapshot.campaigns.find((item) => item.slug === slug)
}

export async function getPlace(slug: string) {
  const snapshot = await getExplorerSnapshot()
  return snapshot.places.find((item) => item.slug === slug)
}

export async function getQuiz(slug: string) {
  const snapshot = await getExplorerSnapshot()
  return snapshot.quizzes.find((item) => item.slug === slug)
}
