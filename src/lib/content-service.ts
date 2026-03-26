import { getPayload } from 'payload'

import {
  demoCampaigns,
  demoEvents,
  demoHistoricalOverlays,
  demoPeriods,
  demoPlaces,
  demoQuizzes,
  demoSources,
} from '../data/demo-content.js'
import {
  supplementalLeaderCopyBySlug,
  supplementalLeaderEvents,
  supplementalLeaderPlaces,
  supplementalLeaderPresentationBySlug,
  supplementalLeaderQuizzes,
} from '../data/leader-detail-backfills.js'
import {
  demoLeaders,
  leaderContentReferencesBySlug,
  type LeaderContentReferenceSet,
  periodMetadataBySlug,
  supplementalPeriods,
} from '../data/leader-content.js'
import type {
  BoundaryEpochRecord,
  CampaignRecord,
  EventRecord,
  ExplorerSnapshot,
  ExplorerRecord,
  HistoricalAdminUnitRecord,
  LeaderRecord,
  OverlayRecord,
  PeriodRecord,
  PlaceRecord,
  QuizRecord,
  SourceRecord,
} from './content-types.js'
import {
  buildHistoricalBoundaryBundle,
  findBoundaryEpochForYear,
} from './historical-boundaries.js'
import { parseSearchState, type SearchState } from './search-state.js'
import { getMongoConnectionString, isDemoFallbackEnabled } from './storage-config.js'
import { toPlainText } from './richtext.js'

let payloadPromise: Promise<Awaited<ReturnType<typeof getPayload>> | null> | null = null
let fallbackSnapshotCache: ExplorerSnapshot | null = null
let explorerSnapshotCache:
  | {
      expiresAt: number
      snapshot: ExplorerSnapshot
    }
  | null = null
let leaderReferenceMapCache = new Map<string, LeaderContentReferenceSet>(
  Object.entries(leaderContentReferencesBySlug).map(([slug, refs]) => [slug, { ...refs }]),
)

const SNAPSHOT_CACHE_TTL_MS = 60_000
const mergedDemoPlaces = [...demoPlaces, ...supplementalLeaderPlaces]
const mergedDemoEvents = [...demoEvents, ...supplementalLeaderEvents]
const mergedDemoQuizzes = [...demoQuizzes, ...supplementalLeaderQuizzes]

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
    payloadPromise = import('../../payload.config.js')
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

function makeLeaderId(slug: string) {
  return `leader:${slug}`
}

function makeRecordId(prefix: string, slug: string) {
  return `${prefix}:${slug}`
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined
  }

  const items = value.filter((item): item is string => typeof item === 'string')
  return items.length > 0 ? items : undefined
}

function normalizeRelationshipSlugArray(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined
  }

  const items = value
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (!item || typeof item !== 'object') {
        return null
      }

      if ('slug' in item && typeof item.slug === 'string') {
        return item.slug
      }

      if ('value' in item && typeof item.value === 'string') {
        return item.value
      }

      return null
    })
    .filter((item): item is string => Boolean(item))

  return items.length > 0 ? items : undefined
}

function indexSources(sources: SourceRecord[]) {
  const map = new Map<string, SourceRecord>()

  for (const source of sources) {
    map.set(source.id, source)
    map.set(source.slug, source)
  }

  return map
}

function withPeriodMetadata(
  period: Omit<PeriodRecord, 'displayOrder' | 'officialLeaderSlugs' | 'periodType'> &
    Pick<
      Partial<PeriodRecord>,
      'displayOrder' | 'featuredLeaderSlug' | 'leadershipLabel' | 'officialLeaderSlugs' | 'periodType'
    >,
): PeriodRecord {
  const metadata = periodMetadataBySlug[period.slug]
  const featuredLeaderSlug = period.featuredLeaderSlug ?? metadata?.featuredLeaderSlug
  const officialLeaderSlugs =
    period.officialLeaderSlugs ?? metadata?.officialLeaderSlugs ?? (featuredLeaderSlug ? [featuredLeaderSlug] : [])

  return {
    ...period,
    displayOrder: period.displayOrder ?? metadata?.displayOrder ?? period.startYear,
    featuredLeaderSlug,
    leadershipLabel: period.leadershipLabel ?? metadata?.leadershipLabel,
    officialLeaderSlugs,
    periodType: period.periodType ?? metadata?.periodType ?? 'party-era',
  }
}

function buildDemoLeaderRecords(sourceMap: Map<string, SourceRecord>) {
  return demoLeaders
    .map<LeaderRecord>((leader) => {
      const copyOverride = supplementalLeaderCopyBySlug[leader.slug]
      const presentationOverride = supplementalLeaderPresentationBySlug[leader.slug]

      return {
        displayName: presentationOverride?.displayName,
        endYear: leader.endYear,
        id: makeLeaderId(leader.slug),
        isFeaturedChairmanHighlight: leader.isFeaturedChairmanHighlight,
        name: leader.name,
        officeLabel: presentationOverride?.officeLabel ?? leader.officeLabel,
        officeType: leader.officeType,
        overview: copyOverride?.overview ?? leader.overview,
        portraitUrl: leader.portraitUrl,
        slug: leader.slug,
        sources: leader.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
        startYear: leader.startYear,
        summary: presentationOverride?.summary ?? copyOverride?.summary ?? leader.summary,
        tenureLabel: presentationOverride?.tenureLabel,
        terms: presentationOverride?.terms,
      }
    })
    .sort((left, right) => left.startYear - right.startYear)
}

function buildGeneratedBoundaryRecords(sourceMap: Map<string, SourceRecord>) {
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

  return { adminUnits, boundaryEpochs }
}

function normalizeSlugSet(slugs: string[]) {
  return [...new Set(slugs)].sort((left, right) => left.localeCompare(right, 'vi'))
}

function sameSlugSet(left: string[], right: string[]) {
  const normalizedLeft = normalizeSlugSet(left)
  const normalizedRight = normalizeSlugSet(right)

  if (normalizedLeft.length !== normalizedRight.length) {
    return false
  }

  return normalizedLeft.every((slug, index) => slug === normalizedRight[index])
}

function featureCount(collection?: { features?: unknown[] } | null) {
  return Array.isArray(collection?.features) ? collection.features.length : 0
}

function shouldReplaceAdminUnitWithGenerated(
  payloadUnit: HistoricalAdminUnitRecord | undefined,
  generatedUnit: HistoricalAdminUnitRecord,
) {
  if (!payloadUnit) {
    return true
  }

  return (
    payloadUnit.validFromYear !== generatedUnit.validFromYear ||
    payloadUnit.validToYear !== generatedUnit.validToYear ||
    payloadUnit.unitType !== generatedUnit.unitType ||
    !sameSlugSet(payloadUnit.memberProvinceSlugs, generatedUnit.memberProvinceSlugs) ||
    !sameSlugSet(payloadUnit.predecessorCanonicalSlugs, generatedUnit.predecessorCanonicalSlugs)
  )
}

function remapBoundaryEpochUnits(
  epoch: BoundaryEpochRecord,
  adminUnitMapBySlug: Map<string, HistoricalAdminUnitRecord>,
): BoundaryEpochRecord {
  return {
    ...epoch,
    units: epoch.units.map((unit) => adminUnitMapBySlug.get(unit.slug) ?? unit),
  }
}

function shouldReplaceBoundaryEpochWithGenerated(
  payloadEpoch: BoundaryEpochRecord | undefined,
  generatedEpoch: BoundaryEpochRecord,
) {
  if (!payloadEpoch) {
    return true
  }

  return (
    payloadEpoch.validFromYear !== generatedEpoch.validFromYear ||
    payloadEpoch.validToYear !== generatedEpoch.validToYear ||
    !sameSlugSet(
      payloadEpoch.units.map((unit) => unit.slug),
      generatedEpoch.units.map((unit) => unit.slug),
    ) ||
    featureCount(payloadEpoch.boundaryFeatures) !== featureCount(generatedEpoch.boundaryFeatures) ||
    featureCount(payloadEpoch.labelFeatures) !== featureCount(generatedEpoch.labelFeatures)
  )
}

function mapLeaderDoc(doc: any, sourceMap: Map<string, SourceRecord>): LeaderRecord {
  return {
    displayName: typeof doc.displayName === 'string' ? doc.displayName : undefined,
    endYear: doc.endYear,
    id: String(doc.id),
    isFeaturedChairmanHighlight: Boolean(doc.isFeaturedChairmanHighlight),
    name: doc.name,
    officeLabel: doc.officeLabel,
    officeType: doc.officeType === 'party-chairman' ? 'party-chairman' : 'general-secretary',
    overview: toPlainText(doc.overview),
    portraitUrl:
      typeof doc.portrait?.url === 'string'
        ? doc.portrait.url
        : typeof doc.portraitUrl === 'string'
          ? doc.portraitUrl
          : undefined,
    slug: doc.slug,
    sources: Array.isArray(doc.sources)
      ? doc.sources
          .map((source: any) => sourceMap.get(String(source.id)))
          .filter(Boolean) as SourceRecord[]
      : [],
    startYear: doc.startYear,
    summary: doc.summary ?? '',
    tenureLabel: typeof doc.tenureLabel === 'string' ? doc.tenureLabel : undefined,
    terms: Array.isArray(doc.terms)
      ? doc.terms
          .filter(
            (term: any) =>
              typeof term?.startYear === 'number' &&
              typeof term?.endYear === 'number' &&
              typeof term?.label === 'string',
          )
          .map((term: any) => ({
            endYear: term.endYear,
            label: term.label,
            startYear: term.startYear,
          }))
      : undefined,
  }
}

function mapLeaderReferences(doc: any): LeaderContentReferenceSet {
  return {
    campaignSlugs: normalizeRelationshipSlugArray(doc.relatedCampaigns),
    eventSlugs: normalizeRelationshipSlugArray(doc.relatedEvents),
    placeSlugs: normalizeRelationshipSlugArray(doc.relatedPlaces),
    quizSlugs: normalizeRelationshipSlugArray(doc.relatedQuizzes),
  }
}

function buildLeaderReferenceMap(docs: any[]) {
  const map = new Map<string, LeaderContentReferenceSet>(
    Object.entries(leaderContentReferencesBySlug).map(([slug, refs]) => [slug, { ...refs }]),
  )

  for (const doc of docs) {
    if (typeof doc?.slug !== 'string') {
      continue
    }

    const current = map.get(doc.slug) ?? {}
    const next = mapLeaderReferences(doc)

    map.set(doc.slug, {
      campaignSlugs: next.campaignSlugs ?? current.campaignSlugs,
      eventSlugs: next.eventSlugs ?? current.eventSlugs,
      placeSlugs: next.placeSlugs ?? current.placeSlugs,
      quizSlugs: next.quizSlugs ?? current.quizSlugs,
    })
  }

  return map
}

function buildFallbackSnapshot(): ExplorerSnapshot {
  if (fallbackSnapshotCache) {
    return fallbackSnapshotCache
  }

  const sources: SourceRecord[] = demoSources.map((source) => ({
    ...source,
    id: makeSourceId(source.slug),
  }))

  const sourceMap = indexSources(sources)

  const periods: PeriodRecord[] = [...demoPeriods, ...supplementalPeriods]
    .map((period) =>
      withPeriodMetadata({
        ...period,
        id: makePeriodId(period.slug),
        keyThemes: period.keyThemes.map((theme) => theme.label),
      }),
    )
    .sort((left, right) => left.displayOrder - right.displayOrder)

  const periodMap = new Map(periods.map((period) => [period.slug, period]))
  const leaders = buildDemoLeaderRecords(sourceMap)
  leaderReferenceMapCache = new Map<string, LeaderContentReferenceSet>(
    Object.entries(leaderContentReferencesBySlug).map(([slug, refs]) => [slug, { ...refs }]),
  )

  const { adminUnits, boundaryEpochs } = buildGeneratedBoundaryRecords(sourceMap)

  const places: PlaceRecord[] = mergedDemoPlaces.map((place) => ({
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

  const events: EventRecord[] = mergedDemoEvents.map((event) => ({
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

  const quizzes: QuizRecord[] = mergedDemoQuizzes.map((quiz) => ({
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
    leaders,
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
  const featuredLeaderSlug =
    typeof doc.featuredLeader?.slug === 'string'
      ? doc.featuredLeader.slug
      : typeof doc.featuredLeaderSlug === 'string'
        ? doc.featuredLeaderSlug
        : typeof doc.leaderSlug === 'string'
          ? doc.leaderSlug
          : undefined

  const officialLeaderSlugs =
    normalizeRelationshipSlugArray(doc.officialLeaders) ??
    normalizeStringArray(doc.officialLeaderSlugs) ??
    normalizeStringArray(doc.leaderSlugs)

  return withPeriodMetadata({
    accentColor: doc.accentColor ?? '#ab2f24',
    displayOrder: typeof doc.displayOrder === 'number' ? doc.displayOrder : undefined,
    endYear: doc.endYear,
    featuredLeaderSlug,
    id: String(doc.id),
    keyThemes: Array.isArray(doc.keyThemes) ? doc.keyThemes.map((item: any) => item.label) : [],
    leadershipLabel:
      typeof doc.leadershipLabel === 'string'
        ? doc.leadershipLabel
        : typeof doc.officeLabel === 'string'
          ? doc.officeLabel
          : undefined,
    officialLeaderSlugs: officialLeaderSlugs ?? (featuredLeaderSlug ? [featuredLeaderSlug] : undefined),
    overview: toPlainText(doc.overview),
    periodType: doc.periodType === 'formation' || doc.periodType === 'party-era' ? doc.periodType : undefined,
    slug: doc.slug,
    startYear: doc.startYear,
    summary: doc.summary ?? '',
    title: doc.title,
  })
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
      leaderDocs,
      adminUnitDocs,
      boundaryEpochDocs,
      placeDocs,
      eventDocs,
      campaignDocs,
      overlayDocs,
      quizDocs,
    ] = await Promise.all([
      payload.find({ collection: 'sources', depth: 0, limit: 100, pagination: false, where }),
      payload.find({ collection: 'periods', depth: 1, limit: 100, pagination: false, where }),
      payload.find({ collection: 'leaders', depth: 1, limit: 100, pagination: false, where }),
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

    const payloadSources = sourceDocs.docs.map(mapSourceDoc)
    const supplementalSources: SourceRecord[] = demoSources
      .filter((source) => !payloadSources.some((item) => item.slug === source.slug))
      .map((source) => ({
        ...source,
        id: makeSourceId(source.slug),
      }))
    const sources = [...payloadSources, ...supplementalSources]
    const sourceMap = indexSources(sources)
    const payloadPeriods = periodDocs.docs.map(mapPeriodDoc)
    const supplementalCorePeriods = demoPeriods
      .filter((period) => !payloadPeriods.some((item) => item.slug === period.slug))
      .map((period) =>
        withPeriodMetadata({
          ...period,
          id: makePeriodId(period.slug),
          keyThemes: period.keyThemes.map((theme) => theme.label),
        }),
      )
    const supplementalPeriodRecords = supplementalPeriods
      .filter((period) => !payloadPeriods.some((item) => item.slug === period.slug))
      .map((period) =>
        withPeriodMetadata({
          ...period,
          id: makePeriodId(period.slug),
          keyThemes: period.keyThemes.map((theme) => theme.label),
        }),
      )
    const periods = [...payloadPeriods, ...supplementalCorePeriods, ...supplementalPeriodRecords].sort(
      (left, right) => left.displayOrder - right.displayOrder,
    )
    const periodMap = new Map(periods.map((period) => [period.id, period]))
    const periodMapBySlug = new Map(periods.map((period) => [period.slug, period]))
    const payloadLeaders = leaderDocs.docs.map((doc: any) => mapLeaderDoc(doc, sourceMap))
    const supplementalLeaders = buildDemoLeaderRecords(sourceMap).filter(
      (leader) => !payloadLeaders.some((item) => item.slug === leader.slug),
    )
    const leaders = [...payloadLeaders, ...supplementalLeaders].sort(
      (left, right) => left.startYear - right.startYear,
    )
    leaderReferenceMapCache = buildLeaderReferenceMap(leaderDocs.docs)

    const payloadAdminUnits = adminUnitDocs.docs.map((doc: any) => mapHistoricalAdminUnitDoc(doc, sourceMap))
    const payloadAdminUnitsBySlug = new Map(payloadAdminUnits.map((unit) => [unit.slug, unit]))
    const { adminUnits: generatedAdminUnits, boundaryEpochs: generatedBoundaryEpochs } =
      buildGeneratedBoundaryRecords(sourceMap)

    for (const generatedUnit of generatedAdminUnits) {
      const payloadUnit = payloadAdminUnitsBySlug.get(generatedUnit.slug)

      if (shouldReplaceAdminUnitWithGenerated(payloadUnit, generatedUnit)) {
        payloadAdminUnitsBySlug.set(generatedUnit.slug, generatedUnit)
      }
    }

    const adminUnits = [...payloadAdminUnitsBySlug.values()].sort(
      (left, right) =>
        left.validFromYear - right.validFromYear || left.title.localeCompare(right.title, 'vi'),
    )
    const adminUnitMapById = new Map(adminUnits.map((unit) => [unit.id, unit]))
    const adminUnitMapBySlug = new Map(adminUnits.map((unit) => [unit.slug, unit]))
    const payloadBoundaryEpochs = boundaryEpochDocs.docs.map((doc: any) =>
      remapBoundaryEpochUnits(mapBoundaryEpochDoc(doc, adminUnitMapById, sourceMap), adminUnitMapBySlug),
    )
    const payloadBoundaryEpochsBySlug = new Map(payloadBoundaryEpochs.map((epoch) => [epoch.slug, epoch]))

    for (const generatedEpoch of generatedBoundaryEpochs) {
      const payloadEpoch = payloadBoundaryEpochsBySlug.get(generatedEpoch.slug)

      if (shouldReplaceBoundaryEpochWithGenerated(payloadEpoch, generatedEpoch)) {
        payloadBoundaryEpochsBySlug.set(generatedEpoch.slug, generatedEpoch)
      }
    }

    const boundaryEpochs = [...payloadBoundaryEpochsBySlug.values()].sort(
      (left, right) => left.validFromYear - right.validFromYear,
    )

    const payloadPlaces = placeDocs.docs.map((doc) => mapPlaceDoc(doc, periodMap, sourceMap))
    const supplementalPlaces: PlaceRecord[] = mergedDemoPlaces
      .filter((place) => !payloadPlaces.some((item) => item.slug === place.slug))
      .map((place) => ({
        body: place.body,
        historicalGeometry: place.historicalGeometry,
        id: makeRecordId('place', place.slug),
        modernLocation: place.modernLocation,
        period: periodMapBySlug.get(place.period)!,
        region: place.region,
        slug: place.slug,
        sources: place.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
        summary: place.summary,
        title: place.title,
      }))
    const places = [...payloadPlaces, ...supplementalPlaces]
    const placeMap = new Map(places.map((place) => [place.id, place]))
    const placeMapBySlug = new Map(places.map((place) => [place.slug, place]))

    const payloadEvents: EventRecord[] = eventDocs.docs.map((doc: any) => ({
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
    const supplementalEvents: EventRecord[] = mergedDemoEvents
      .filter((event) => !payloadEvents.some((item) => item.slug === event.slug))
      .map((event) => ({
        content: event.content,
        datePrecision: event.datePrecision,
        displayYear: event.displayYear,
        endDate: event.endDate,
        historicalGeometry: event.historicalGeometry,
        id: makeRecordId('event', event.slug),
        mediaUrls: [],
        modernLocation: event.modernLocation,
        period: periodMapBySlug.get(event.period)!,
        places: event.places.map((slug) => placeMapBySlug.get(slug)!).filter(Boolean),
        region: event.region,
        slug: event.slug,
        sources: event.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
        startDate: event.startDate,
        summary: event.summary,
        title: event.title,
        topics: event.topics,
      }))
    const events = [...payloadEvents, ...supplementalEvents]
    const eventMap = new Map(events.map((event) => [event.id, event]))
    const eventMapBySlug = new Map(events.map((event) => [event.slug, event]))

    const payloadCampaigns: CampaignRecord[] = campaignDocs.docs.map((doc: any) => ({
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
    const supplementalCampaigns: CampaignRecord[] = demoCampaigns
      .filter((campaign) => !payloadCampaigns.some((item) => item.slug === campaign.slug))
      .map((campaign) => ({
        body: campaign.body,
        datePrecision: campaign.datePrecision,
        displayYear: campaign.displayYear,
        endDate: campaign.endDate,
        historicalGeometry: campaign.historicalGeometry,
        id: makeRecordId('campaign', campaign.slug),
        mediaUrls: [],
        modernLocation: campaign.modernLocation,
        outcome: campaign.outcome,
        period: periodMapBySlug.get(campaign.period)!,
        region: campaign.region,
        relatedEvents: campaign.relatedEvents
          .map((slug) => eventMapBySlug.get(slug)!)
          .filter(Boolean),
        relatedPlaces: campaign.relatedPlaces
          .map((slug) => placeMapBySlug.get(slug)!)
          .filter(Boolean),
        slug: campaign.slug,
        sources: campaign.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
        startDate: campaign.startDate,
        summary: campaign.summary,
        title: campaign.title,
      }))
    const campaigns = [...payloadCampaigns, ...supplementalCampaigns]

    const payloadOverlays: OverlayRecord[] = overlayDocs.docs.map((doc: any) => ({
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
    const supplementalOverlays: OverlayRecord[] = demoHistoricalOverlays
      .filter((overlay) => !payloadOverlays.some((item) => item.slug === overlay.slug))
      .map((overlay) => ({
        ...overlay,
        id: makeRecordId('overlay', overlay.slug),
        period: periodMapBySlug.get(overlay.period)!,
        sources: overlay.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
      }))
    const overlays = [...payloadOverlays, ...supplementalOverlays]

    const campaignMap = new Map(campaigns.map((campaign) => [campaign.id, campaign]))
    const campaignMapBySlug = new Map(campaigns.map((campaign) => [campaign.slug, campaign]))

    const payloadQuizzes: QuizRecord[] = quizDocs.docs.map((doc: any) => ({
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
    const supplementalQuizzes: QuizRecord[] = mergedDemoQuizzes
      .filter((quiz) => !payloadQuizzes.some((item) => item.slug === quiz.slug))
      .map((quiz) => ({
        ...quiz,
        id: makeRecordId('quiz', quiz.slug),
        period: periodMapBySlug.get(quiz.period)!,
        relatedCampaigns: quiz.relatedCampaigns
          .map((slug) => campaignMapBySlug.get(slug)!)
          .filter(Boolean),
        relatedEvents: quiz.relatedEvents.map((slug) => eventMapBySlug.get(slug)!).filter(Boolean),
        sources: quiz.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
      }))
    const quizzes = [...payloadQuizzes, ...supplementalQuizzes]

    return {
      adminUnits,
      boundaryEpochs,
      campaigns,
      events,
      leaders,
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

function findLeader(snapshot: ExplorerSnapshot, slug?: string) {
  if (!slug) {
    return null
  }

  return snapshot.leaders.find((leader) => leader.slug === slug) ?? null
}

function periodHasFeaturedLeader(period: PeriodRecord, leaderSlug: string) {
  return period.featuredLeaderSlug === leaderSlug
}

function periodHasOfficialLeader(period: PeriodRecord, leaderSlug: string) {
  return period.officialLeaderSlugs.includes(leaderSlug)
}

function leaderTerms(leader: LeaderRecord) {
  return leader.terms?.length
    ? leader.terms
    : [{ endYear: leader.endYear, label: leader.tenureLabel ?? leader.officeLabel, startYear: leader.startYear }]
}

function leaderCoversYear(leader: LeaderRecord, year: number) {
  return leaderTerms(leader).some((term) => year >= term.startYear && year <= term.endYear)
}

function leaderOverlapsRecordRange(
  leader: LeaderRecord,
  startDate: string | undefined,
  endDate: string | undefined,
) {
  return leaderTerms(leader).some((term) =>
    dateRangeOverlapsYears(startDate, endDate, term.startYear, term.endYear),
  )
}

function leaderLatestYear(leader: LeaderRecord) {
  return leaderTerms(leader).reduce((maxYear, term) => Math.max(maxYear, term.endYear), leader.endYear)
}

type LeaderSelectionContext = {
  campaignSlugs: Set<string>
  eventSlugs: Set<string>
  featuredPeriods: PeriodRecord[]
  leader: LeaderRecord
  officialPeriods: PeriodRecord[]
  periodSlugs: Set<string>
  placeSlugs: Set<string>
  quizSlugs: Set<string>
}

function quizReferencesAnyDirectRecord(
  quiz: QuizRecord,
  events: EventRecord[],
  campaigns: CampaignRecord[],
) {
  const eventSlugs = new Set(events.map((event) => event.slug))
  const campaignSlugs = new Set(campaigns.map((campaign) => campaign.slug))

  return (
    quiz.relatedEvents.some((event) => eventSlugs.has(event.slug)) ||
    quiz.relatedCampaigns.some((campaign) => campaignSlugs.has(campaign.slug))
  )
}

function buildLeaderDetailSnapshot(
  snapshot: ExplorerSnapshot,
  leader: LeaderRecord,
  context: LeaderSelectionContext,
): ExplorerSnapshot {
  const broadSnapshot = filterSnapshot(snapshot, { layer: 'all', leader: leader.slug, type: 'all' })
  const directEvents = snapshot.events
    .filter((event) => context.eventSlugs.has(event.slug))
    .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime())
  const directCampaigns = snapshot.campaigns
    .filter((campaign) => context.campaignSlugs.has(campaign.slug))
    .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime())
  const linkedPlaceSlugs = new Set<string>([
    ...directEvents.flatMap((event) => event.places.map((place) => place.slug)),
    ...directCampaigns.flatMap((campaign) => campaign.relatedPlaces.map((place) => place.slug)),
  ])
  const explicitPlaces = snapshot.places.filter((place) => context.placeSlugs.has(place.slug))
  const linkedPlaces = snapshot.places.filter(
    (place) => !context.placeSlugs.has(place.slug) && linkedPlaceSlugs.has(place.slug),
  )
  const directPlaces = [...explicitPlaces, ...linkedPlaces]
  const referencedQuizzes = snapshot.quizzes.filter((quiz) => context.quizSlugs.has(quiz.slug))
  const directQuizzes =
    referencedQuizzes.length > 0
      ? referencedQuizzes
      : snapshot.quizzes.filter((quiz) => quizReferencesAnyDirectRecord(quiz, directEvents, directCampaigns))

  return {
    ...broadSnapshot,
    activeLeader: leader,
    campaigns: directCampaigns.length > 0 ? directCampaigns : broadSnapshot.campaigns,
    events: directEvents.length > 0 ? directEvents : broadSnapshot.events,
    periods: snapshot.periods.filter((period) => context.periodSlugs.has(period.slug)),
    places: directPlaces.length > 0 ? directPlaces : broadSnapshot.places,
    quizzes: directQuizzes.length > 0 ? directQuizzes : broadSnapshot.quizzes,
  }
}

function buildLeaderSelectionContext(
  snapshot: ExplorerSnapshot,
  leaderOrSlug?: LeaderRecord | string | null,
): LeaderSelectionContext | null {
  const leader =
    typeof leaderOrSlug === 'string'
      ? findLeader(snapshot, leaderOrSlug)
      : leaderOrSlug ?? null

  if (!leader) {
    return null
  }

  const featuredPeriods = snapshot.periods.filter((period) => periodHasFeaturedLeader(period, leader.slug))
  const officialPeriods = snapshot.periods.filter((period) => periodHasOfficialLeader(period, leader.slug))
  const refs = leaderReferenceMapCache.get(leader.slug) ?? leaderContentReferencesBySlug[leader.slug]

  return {
    campaignSlugs: new Set(refs?.campaignSlugs ?? []),
    eventSlugs: new Set(refs?.eventSlugs ?? []),
    featuredPeriods,
    leader,
    officialPeriods,
    periodSlugs: new Set([...featuredPeriods, ...officialPeriods].map((period) => period.slug)),
    placeSlugs: new Set(refs?.placeSlugs ?? []),
    quizSlugs: new Set(refs?.quizSlugs ?? []),
  }
}

function resolveLeaderForYear(snapshot: ExplorerSnapshot, year: number, activePeriod?: PeriodRecord | null) {
  if (activePeriod?.featuredLeaderSlug) {
    return findLeader(snapshot, activePeriod.featuredLeaderSlug)
  }

  if (activePeriod?.officialLeaderSlugs.length) {
    const matchingInPeriod = activePeriod.officialLeaderSlugs
      .map((slug) => findLeader(snapshot, slug))
      .filter((leader): leader is LeaderRecord => Boolean(leader))
      .sort((left, right) => right.startYear - left.startYear)

    const coveringLeader = matchingInPeriod.find((leader) => leaderCoversYear(leader, year)) ?? null

    if (coveringLeader) {
      return coveringLeader
    }

    return matchingInPeriod[0] ?? null
  }

  if (activePeriod?.periodType === 'formation') {
    return null
  }

  const coveringLeaders = snapshot.leaders
    .filter((leader) => leaderCoversYear(leader, year))
    .sort((left, right) => right.startYear - left.startYear)

  return coveringLeaders[0] ?? null
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

function dateRangeOverlapsYears(
  startDate: string | undefined,
  endDate: string | undefined,
  startYear: number,
  endYear: number,
) {
  if (!startDate) {
    return false
  }

  const recordStartYear = new Date(startDate).getUTCFullYear()
  const recordEndYear = endDate ? new Date(endDate).getUTCFullYear() : recordStartYear

  return recordStartYear <= endYear && recordEndYear >= startYear
}

function recordOverlapsLeaderYears(
  leader: LeaderRecord,
  displayYear?: number,
  startDate?: string,
  endDate?: string,
) {
  if (typeof displayYear === 'number') {
    return leaderCoversYear(leader, displayYear)
  }

  return leaderOverlapsRecordRange(leader, startDate, endDate)
}

function recordMatchesLeaderPeriods(
  period: PeriodRecord,
  context: LeaderSelectionContext,
  displayYear?: number,
  startDate?: string,
  endDate?: string,
) {
  if (!context.periodSlugs.has(period.slug)) {
    return false
  }

  return recordOverlapsLeaderYears(context.leader, displayYear, startDate, endDate)
}

function eventMatchesLeader(event: EventRecord, context: LeaderSelectionContext) {
  return (
    context.eventSlugs.has(event.slug) ||
    recordMatchesLeaderPeriods(event.period, context, event.displayYear, event.startDate, event.endDate)
  )
}

function campaignMatchesLeader(campaign: CampaignRecord, context: LeaderSelectionContext) {
  return (
    context.campaignSlugs.has(campaign.slug) ||
    recordMatchesLeaderPeriods(
      campaign.period,
      context,
      campaign.displayYear,
      campaign.startDate,
      campaign.endDate,
    )
  )
}

function overlayMatchesLeader(overlay: OverlayRecord, context: LeaderSelectionContext) {
  return recordMatchesLeaderPeriods(overlay.period, context, undefined, overlay.validFrom, overlay.validTo)
}

function quizMatchesLeader(quiz: QuizRecord, context: LeaderSelectionContext) {
  return context.quizSlugs.has(quiz.slug) || context.periodSlugs.has(quiz.period.slug)
}

function matchesQuizQuery(quiz: QuizRecord, query?: string) {
  if (!query?.trim()) {
    return true
  }

  const normalizedQuery = query.trim().toLowerCase()

  return (
    quiz.title.toLowerCase().includes(normalizedQuery) ||
    quiz.summary.toLowerCase().includes(normalizedQuery) ||
    quiz.period.title.toLowerCase().includes(normalizedQuery)
  )
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

  if (filters.leader) {
    const leaderContext = buildLeaderSelectionContext(snapshot, filters.leader)

    if (leaderContext) {
      const leaderRecordYears = [
        ...snapshot.events
          .filter((event) => eventMatchesLeader(event, leaderContext))
          .map((event) => event.displayYear),
        ...snapshot.campaigns
          .filter((campaign) => campaignMatchesLeader(campaign, leaderContext))
          .map((campaign) => campaign.displayYear),
      ]

      if (leaderRecordYears.length > 0) {
        return Math.max(...leaderRecordYears)
      }

      const maxPeriodYear = [...leaderContext.featuredPeriods, ...leaderContext.officialPeriods].reduce(
        (maxYear, period) => Math.max(maxYear, period.endYear),
        0,
      )

      if (maxPeriodYear > 0) {
        return maxPeriodYear
      }

      const maxBoundaryYear = snapshot.boundaryEpochs.reduce(
        (maxYear, epoch) =>
          epoch.validFromYear <= leaderLatestYear(leaderContext.leader)
            ? Math.max(maxYear, Math.min(epoch.validToYear, leaderLatestYear(leaderContext.leader)))
            : maxYear,
        0,
      )

      if (maxBoundaryYear > 0) {
        return maxBoundaryYear
      }

      return leaderLatestYear(leaderContext.leader)
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
  const leaderContext = buildLeaderSelectionContext(snapshot, filters.leader)
  const selectedLeader = leaderContext?.leader ?? null
  const periods = leaderContext
    ? snapshot.periods.filter((period) => leaderContext.periodSlugs.has(period.slug))
    : snapshot.periods
  const boundaryEpochs = selectedLeader
    ? snapshot.boundaryEpochs.filter(
        (epoch) =>
          leaderTerms(selectedLeader).some(
            (term) => epoch.validFromYear <= term.endYear && epoch.validToYear >= term.startYear,
          ),
      )
    : snapshot.boundaryEpochs
  const activeBoundaryEpoch =
    findBoundaryEpochForYear(boundaryEpochs, activeYear) ??
    findBoundaryEpochForYear(snapshot.boundaryEpochs, activeYear)
  const activePeriod =
    (filters.period ? periods.find((period) => period.slug === filters.period) : null) ??
    periods.find((period) => periodMatchesYear(period, activeYear)) ??
    null
  const activeLeader = selectedLeader ?? resolveLeaderForYear(snapshot, activeYear, activePeriod)

  const events = snapshot.events.filter((event) => {
    if (filters.period && event.period.slug !== filters.period) return false
    if (leaderContext && !eventMatchesLeader(event, leaderContext)) {
      return false
    }
    if (typeof filters.year === 'number' && !periodMatchesYear(event.period, filters.year)) return false
    if (filters.region && event.region !== filters.region) return false
    if (!matchesQuery(event, filters.q)) return false
    return recordMatchesYear(event.displayYear, event.startDate, event.endDate, filters)
  })

  const campaigns = snapshot.campaigns.filter((campaign) => {
    if (filters.period && campaign.period.slug !== filters.period) return false
    if (leaderContext && !campaignMatchesLeader(campaign, leaderContext)) {
      return false
    }
    if (typeof filters.year === 'number' && !periodMatchesYear(campaign.period, filters.year)) return false
    if (filters.region && campaign.region !== filters.region) return false
    if (!matchesQuery(campaign, filters.q)) return false
    return recordMatchesYear(campaign.displayYear, campaign.startDate, campaign.endDate, filters)
  })

  const linkedPlaceSlugs = new Set<string>([
    ...events.flatMap((event) => event.places.map((place) => place.slug)),
    ...campaigns.flatMap((campaign) => campaign.relatedPlaces.map((place) => place.slug)),
  ])

  const places = snapshot.places.filter((place) => {
    if (filters.period && place.period.slug !== filters.period) return false
    if (leaderContext && !leaderContext.placeSlugs.has(place.slug) && !linkedPlaceSlugs.has(place.slug)) {
      return false
    }
    if (typeof filters.year === 'number' && !periodMatchesYear(place.period, filters.year)) return false
    if (filters.region && place.region !== filters.region) return false
    return matchesQuery(place, filters.q)
  })

  const overlays = snapshot.overlays.filter((overlay) => {
    if (filters.period && overlay.period.slug !== filters.period) return false
    if (leaderContext && !overlayMatchesLeader(overlay, leaderContext)) {
      return false
    }
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

  const hasSliceFilter =
    Boolean(filters.period || filters.leader) ||
    typeof filters.year === 'number' ||
    typeof filters.from === 'number' ||
    typeof filters.to === 'number'

  const quizzes = snapshot.quizzes.filter((quiz) => {
    if (filters.period && quiz.period.slug !== filters.period) {
      return false
    }

    if (leaderContext && !quizMatchesLeader(quiz, leaderContext)) {
      return false
    }

    if (typeof filters.year === 'number' && !periodMatchesYear(quiz.period, filters.year)) {
      return false
    }

    if (!matchesQuizQuery(quiz, filters.q)) {
      return false
    }

    if (leaderContext?.quizSlugs.has(quiz.slug)) {
      return true
    }

    if (hasSliceFilter) {
      return quizReferencesAnyDirectRecord(quiz, events, campaigns)
    }

    return true
  })

  return {
    activeBoundaryEpoch,
    activeLeader,
    activeYear,
    adminUnits: activeBoundaryEpoch?.units ?? [],
    boundaryEpochs,
    campaigns,
    events,
    leaders: snapshot.leaders,
    overlays,
    periods,
    places,
    quizzes,
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

export async function getLeaders() {
  const snapshot = await getExplorerSnapshot()
  return snapshot.leaders
}

export async function getLeader(slug: string) {
  const snapshot = await getExplorerSnapshot()
  const leader = snapshot.leaders.find((item) => item.slug === slug)

  if (!leader) {
    return undefined
  }

  const leaderContext = buildLeaderSelectionContext(snapshot, leader)
  const records = leaderContext
    ? buildLeaderDetailSnapshot(snapshot, leader, leaderContext)
    : filterSnapshot(snapshot, { layer: 'all', leader: slug, type: 'all' })

  return {
    featuredPeriods: leaderContext?.featuredPeriods ?? [],
    leader,
    officialPeriods: leaderContext?.officialPeriods ?? [],
    ...records,
  }
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
