import 'dotenv/config'

import { MongoClient } from 'mongodb'

import {
  demoCampaigns,
  demoEvents,
  demoHistoricalOverlays,
  demoPeriods,
  demoPlaces,
  demoQuizzes,
  demoSources,
} from '../src/data/demo-content.js'
import {
  supplementalLeaderCopyBySlug,
  supplementalLeaderEvents,
  supplementalLeaderPlaces,
  supplementalLeaderPresentationBySlug,
  supplementalLeaderQuizzes,
} from '../src/data/leader-detail-backfills.js'
import { demoLeaders, periodMetadataBySlug, supplementalPeriods } from '../src/data/leader-content.js'
import { filterSnapshot } from '../src/lib/content-service.js'
import { buildHistoricalBoundaryBundle } from '../src/lib/historical-boundaries.js'
import { toPlainText } from '../src/lib/richtext.js'
import type {
  BoundaryEpochRecord,
  CampaignRecord,
  EventRecord,
  ExplorerRecord,
  ExplorerSnapshot,
  HistoricalAdminUnitRecord,
  LeaderRecord,
  ModernLocation,
  OverlayRecord,
  PeriodRecord,
  PlaceRecord,
  QuizRecord,
  RecordRegion,
  SourceRecord,
} from '../src/lib/content-types.js'
import type { SearchState } from '../src/lib/search-state.js'

type RawDoc = Record<string, any> & { _id: unknown }
type AuditIssue = {
  code: string
  context: string
  detail: string
  severity: 'error' | 'warning'
}
type RawSnapshotBundle = {
  boundaryEpochDocs: RawDoc[]
  campaignDocs: RawDoc[]
  eventDocs: RawDoc[]
  leaderDocs: RawDoc[]
  overlayDocs: RawDoc[]
  periodDocs: RawDoc[]
  placeDocs: RawDoc[]
  quizDocs: RawDoc[]
  sourceDocs: RawDoc[]
  unitDocs: RawDoc[]
}

const mergedDemoPlaces = [...demoPlaces, ...supplementalLeaderPlaces]
const mergedDemoEvents = [...demoEvents, ...supplementalLeaderEvents]
const mergedDemoQuizzes = [...demoQuizzes, ...supplementalLeaderQuizzes]
const allRegions: RecordRegion[] = ['north', 'central', 'south', 'interregional', 'international']
const allTypes: SearchState['type'][] = ['all', 'events', 'campaigns', 'places']

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

function relationId(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (!value || typeof value !== 'object') {
    return undefined
  }

  if ('id' in value && value.id != null) {
    return String(value.id)
  }

  if ('_id' in value && value._id != null) {
    return String(value._id)
  }

  if ('value' in value && value.value != null) {
    return relationId(value.value)
  }

  if ('slug' in value && typeof value.slug === 'string') {
    return value.slug
  }

  return undefined
}

function normalizeRelationshipSlugArray(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined
  }

  const items = value.map((item) => relationId(item)).filter((item): item is string => Boolean(item))
  return items.length > 0 ? items : undefined
}

function relationIds(value: unknown) {
  return normalizeRelationshipSlugArray(value) ?? []
}

function isPresent<T>(value: T | null | undefined): value is T {
  return value != null
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

function mapSourceDoc(doc: RawDoc): SourceRecord {
  return {
    author: typeof doc.author === 'string' ? doc.author : undefined,
    bibliography: typeof doc.bibliography === 'string' ? doc.bibliography : '',
    id: String(doc._id),
    license: typeof doc.license === 'string' ? doc.license : '',
    publisher: typeof doc.publisher === 'string' ? doc.publisher : undefined,
    reliability: doc.reliability === 'primary' || doc.reliability === 'secondary' ? doc.reliability : 'reference',
    slug: doc.slug,
    sourceType: typeof doc.sourceType === 'string' ? doc.sourceType : 'book',
    summary: typeof doc.summary === 'string' ? doc.summary : '',
    title: doc.title,
    url: typeof doc.url === 'string' ? doc.url : undefined,
    year: typeof doc.year === 'number' ? doc.year : 0,
  }
}

function resolveSources(value: unknown, sourceMap: Map<string, SourceRecord>) {
  return relationIds(value)
    .map((item) => sourceMap.get(item))
    .filter((item): item is SourceRecord => Boolean(item))
}

function mapPeriodDoc(doc: RawDoc): PeriodRecord {
  const featuredLeaderSlug =
    typeof doc.featuredLeaderSlug === 'string'
      ? doc.featuredLeaderSlug
      : typeof doc.leaderSlug === 'string'
        ? doc.leaderSlug
        : relationId(doc.featuredLeader)

  const officialLeaderSlugs =
    normalizeRelationshipSlugArray(doc.officialLeaders) ??
    normalizeStringArray(doc.officialLeaderSlugs) ??
    normalizeStringArray(doc.leaderSlugs)

  return withPeriodMetadata({
    accentColor: typeof doc.accentColor === 'string' ? doc.accentColor : '#ab2f24',
    displayOrder: typeof doc.displayOrder === 'number' ? doc.displayOrder : undefined,
    endYear: doc.endYear,
    featuredLeaderSlug,
    id: String(doc._id),
    keyThemes: Array.isArray(doc.keyThemes)
      ? doc.keyThemes
          .map((item) =>
            typeof item?.label === 'string' ? item.label : typeof item === 'string' ? item : undefined,
          )
          .filter((item): item is string => Boolean(item))
      : [],
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
    summary: typeof doc.summary === 'string' ? doc.summary : '',
    title: doc.title,
  })
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

function mapLeaderDoc(doc: RawDoc, sourceMap: Map<string, SourceRecord>): LeaderRecord {
  return {
    displayName: typeof doc.displayName === 'string' ? doc.displayName : undefined,
    endYear: doc.endYear,
    id: String(doc._id),
    isFeaturedChairmanHighlight: Boolean(doc.isFeaturedChairmanHighlight),
    name: doc.name,
    officeLabel: doc.officeLabel,
    officeType: doc.officeType === 'party-chairman' ? 'party-chairman' : 'general-secretary',
    overview: toPlainText(doc.overview),
    portraitUrl:
      typeof doc.portraitUrl === 'string'
        ? doc.portraitUrl
        : typeof doc.portrait?.url === 'string'
          ? doc.portrait.url
          : undefined,
    slug: doc.slug,
    sources: resolveSources(doc.sources, sourceMap),
    startYear: doc.startYear,
    summary: typeof doc.summary === 'string' ? doc.summary : '',
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

function resolveMapItem<T extends { id: string; slug: string }>(
  value: unknown,
  byId: Map<string, T>,
  bySlug: Map<string, T>,
) {
  const resolved = relationId(value)

  if (!resolved) {
    return undefined
  }

  return byId.get(resolved) ?? bySlug.get(resolved)
}

function mapHistoricalAdminUnitDoc(
  doc: RawDoc,
  sourceMap: Map<string, SourceRecord>,
): HistoricalAdminUnitRecord {
  return {
    canonicalSlug:
      typeof doc.canonicalSlug === 'string'
        ? doc.canonicalSlug
        : typeof doc.slug === 'string'
          ? doc.slug
          : '',
    changeSlug:
      typeof doc.changeSlug === 'string'
        ? doc.changeSlug
        : typeof doc.slug === 'string'
          ? doc.slug
          : '',
    changeType: doc.changeType ?? 'base',
    changeYear:
      typeof doc.changeYear === 'number'
        ? doc.changeYear
        : typeof doc.validFromYear === 'number'
          ? doc.validFromYear
          : 0,
    displayColor: typeof doc.displayColor === 'string' ? doc.displayColor : '#ab2f24',
    id: String(doc._id),
    labelPoint:
      typeof doc.labelPoint?.longitude === 'number' && typeof doc.labelPoint?.latitude === 'number'
        ? {
            latitude: doc.labelPoint.latitude,
            longitude: doc.labelPoint.longitude,
          }
        : undefined,
    memberProvinceSlugs: relationIds(doc.memberProvinceSlugs),
    predecessorCanonicalSlugs: relationIds(doc.predecessorCanonicalSlugs),
    slug: typeof doc.slug === 'string' ? doc.slug : '',
    sources: resolveSources(doc.sources, sourceMap),
    summary: typeof doc.summary === 'string' ? doc.summary : '',
    title: typeof doc.title === 'string' ? doc.title : '',
    unitType: doc.unitType ?? 'province',
    validFromYear: typeof doc.validFromYear === 'number' ? doc.validFromYear : 0,
    validToYear: typeof doc.validToYear === 'number' ? doc.validToYear : 0,
  }
}

function mapBoundaryEpochDoc(
  doc: RawDoc,
  adminUnitMapById: Map<string, HistoricalAdminUnitRecord>,
  adminUnitMapBySlug: Map<string, HistoricalAdminUnitRecord>,
  sourceMap: Map<string, SourceRecord>,
): BoundaryEpochRecord {
  return {
    boundaryFeatures: doc.boundaryFeatures ?? { features: [], type: 'FeatureCollection' },
    id: String(doc._id),
    labelFeatures: doc.labelFeatures ?? { features: [], type: 'FeatureCollection' },
    slug: typeof doc.slug === 'string' ? doc.slug : '',
    sources: resolveSources(doc.sources, sourceMap),
    summary: typeof doc.summary === 'string' ? doc.summary : '',
    title: typeof doc.title === 'string' ? doc.title : '',
    units: relationIds(doc.units)
      .map((unit) => adminUnitMapById.get(unit) ?? adminUnitMapBySlug.get(unit))
      .filter((unit): unit is HistoricalAdminUnitRecord => Boolean(unit)),
    validFromYear: typeof doc.validFromYear === 'number' ? doc.validFromYear : 0,
    validToYear: typeof doc.validToYear === 'number' ? doc.validToYear : 0,
  }
}

function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

function isWithinYear(year: number, startDate?: string, endDate?: string) {
  if (!startDate) {
    return false
  }

  const startYear = new Date(startDate).getUTCFullYear()
  const resolvedEndYear = endDate ? new Date(endDate).getUTCFullYear() : startYear
  return startYear <= year && resolvedEndYear >= year
}

function hasCoordinates(location?: ModernLocation | null) {
  return typeof location?.longitude === 'number' && typeof location?.latitude === 'number'
}

function linkedPlaces(record: ExplorerRecord) {
  if ('places' in record) {
    return record.places
  }

  if ('relatedPlaces' in record) {
    return record.relatedPlaces
  }

  return []
}

function recordHasMapPoint(record: ExplorerRecord) {
  if (hasCoordinates(record.modernLocation)) {
    return true
  }

  return linkedPlaces(record).some((place) => hasCoordinates(place.modernLocation))
}

async function loadPublishedDocs(db: Awaited<ReturnType<MongoClient['db']>>, collection: string) {
  const docs = await db
    .collection<RawDoc>(collection)
    .find({
      $or: [{ _status: 'published' }, { _status: { $exists: false } }],
    })
    .toArray()

  return docs
}

async function loadRawBundle() {
  const uri =
    process.env.MONGODB_URI?.trim() || process.env.DATABASE_URL?.trim() || process.env.DATABASE_URI?.trim()

  if (!uri) {
    throw new Error('Thiếu MONGODB_URI, DATABASE_URL hoặc DATABASE_URI.')
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()

    const [
      sourceDocs,
      periodDocs,
      leaderDocs,
      unitDocs,
      boundaryEpochDocs,
      placeDocs,
      eventDocs,
      campaignDocs,
      overlayDocs,
      quizDocs,
    ] = await Promise.all([
      loadPublishedDocs(db, 'sources'),
      loadPublishedDocs(db, 'periods'),
      loadPublishedDocs(db, 'leaders'),
      loadPublishedDocs(db, 'historical-admin-units'),
      loadPublishedDocs(db, 'boundary-epochs'),
      loadPublishedDocs(db, 'places'),
      loadPublishedDocs(db, 'events'),
      loadPublishedDocs(db, 'campaigns'),
      loadPublishedDocs(db, 'historical-overlays'),
      loadPublishedDocs(db, 'quizzes'),
    ])

    return {
      boundaryEpochDocs,
      campaignDocs,
      eventDocs,
      leaderDocs,
      overlayDocs,
      periodDocs,
      placeDocs,
      quizDocs,
      sourceDocs,
      unitDocs,
    } satisfies RawSnapshotBundle
  } finally {
    await client.close()
  }
}

async function buildDirectSnapshot() {
  const raw = await loadRawBundle()

  const payloadSources = raw.sourceDocs.map(mapSourceDoc)
  const supplementalSources: SourceRecord[] = demoSources
    .filter((source) => !payloadSources.some((item) => item.slug === source.slug))
    .map((source) => ({
      ...source,
      id: makeSourceId(source.slug),
    }))
  const sources = [...payloadSources, ...supplementalSources]
  const sourceMap = indexSources(sources)

  const payloadPeriods = raw.periodDocs.map(mapPeriodDoc)
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
  const periodMapById = new Map(periods.map((period) => [period.id, period]))
  const periodMapBySlug = new Map(periods.map((period) => [period.slug, period]))

  const payloadLeaders = raw.leaderDocs.map((doc) => mapLeaderDoc(doc, sourceMap))
  const supplementalLeaders = buildDemoLeaderRecords(sourceMap).filter(
    (leader) => !payloadLeaders.some((item) => item.slug === leader.slug),
  )
  const leaders = [...payloadLeaders, ...supplementalLeaders].sort(
    (left, right) => left.startYear - right.startYear,
  )

  const payloadAdminUnits = raw.unitDocs.map((doc) => mapHistoricalAdminUnitDoc(doc, sourceMap))
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
    (left, right) => left.validFromYear - right.validFromYear || left.title.localeCompare(right.title, 'vi'),
  )
  const adminUnitMapById = new Map(adminUnits.map((unit) => [unit.id, unit]))
  const adminUnitMapBySlug = new Map(adminUnits.map((unit) => [unit.slug, unit]))
  const payloadBoundaryEpochs = raw.boundaryEpochDocs.map((doc) =>
    remapBoundaryEpochUnits(
      mapBoundaryEpochDoc(doc, adminUnitMapById, adminUnitMapBySlug, sourceMap),
      adminUnitMapBySlug,
    ),
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

  const payloadPlaces: PlaceRecord[] = raw.placeDocs
    .map<PlaceRecord | null>((doc) => {
      const period = resolveMapItem(doc.period, periodMapById, periodMapBySlug)

      if (!period) {
        return null
      }

      return {
        body: toPlainText(doc.body),
        featuredMediaUrl: typeof doc.featuredMedia?.url === 'string' ? doc.featuredMedia.url : undefined,
        historicalGeometry: doc.historicalGeometry ?? undefined,
        id: String(doc._id),
        modernLocation: doc.modernLocation ?? undefined,
        period,
        region: doc.region,
        slug: doc.slug,
        sources: resolveSources(doc.sources, sourceMap),
        summary: typeof doc.summary === 'string' ? doc.summary : '',
        title: doc.title,
      } satisfies PlaceRecord
    })
    .filter(isPresent)
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
  const placeMapById = new Map(places.map((place) => [place.id, place]))
  const placeMapBySlug = new Map(places.map((place) => [place.slug, place]))

  const payloadEvents: EventRecord[] = raw.eventDocs
    .map<EventRecord | null>((doc) => {
      const period = resolveMapItem(doc.period, periodMapById, periodMapBySlug)

      if (!period) {
        return null
      }

      return {
        content: toPlainText(doc.content),
        datePrecision: doc.datePrecision,
        displayYear:
          typeof doc.displayYear === 'number' ? doc.displayYear : new Date(doc.startDate).getUTCFullYear(),
        endDate: typeof doc.endDate === 'string' ? doc.endDate : undefined,
        historicalGeometry: doc.historicalGeometry ?? undefined,
        id: String(doc._id),
        mediaUrls: [],
        modernLocation: doc.modernLocation ?? undefined,
        period,
        places: relationIds(doc.places)
          .map((item) => placeMapById.get(item) ?? placeMapBySlug.get(item))
          .filter((item): item is PlaceRecord => Boolean(item)),
        region: doc.region,
        slug: doc.slug,
        sources: resolveSources(doc.sources, sourceMap),
        startDate: doc.startDate,
        summary: typeof doc.summary === 'string' ? doc.summary : '',
        title: doc.title,
        topics: Array.isArray(doc.topics)
          ? doc.topics.filter((item: unknown): item is string => typeof item === 'string')
          : [],
      } satisfies EventRecord
    })
    .filter(isPresent)
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
  const eventMapById = new Map(events.map((event) => [event.id, event]))
  const eventMapBySlug = new Map(events.map((event) => [event.slug, event]))

  const payloadCampaigns: CampaignRecord[] = raw.campaignDocs
    .map<CampaignRecord | null>((doc) => {
      const period = resolveMapItem(doc.period, periodMapById, periodMapBySlug)

      if (!period) {
        return null
      }

      return {
        body: toPlainText(doc.body),
        datePrecision: doc.datePrecision,
        displayYear:
          typeof doc.displayYear === 'number' ? doc.displayYear : new Date(doc.startDate).getUTCFullYear(),
        endDate: typeof doc.endDate === 'string' ? doc.endDate : undefined,
        historicalGeometry: doc.historicalGeometry ?? undefined,
        id: String(doc._id),
        mediaUrls: [],
        modernLocation: doc.modernLocation ?? undefined,
        outcome: typeof doc.outcome === 'string' ? doc.outcome : '',
        period,
        region: doc.region,
        relatedEvents: relationIds(doc.relatedEvents)
          .map((item) => eventMapById.get(item) ?? eventMapBySlug.get(item))
          .filter((item): item is EventRecord => Boolean(item)),
        relatedPlaces: relationIds(doc.relatedPlaces)
          .map((item) => placeMapById.get(item) ?? placeMapBySlug.get(item))
          .filter((item): item is PlaceRecord => Boolean(item)),
        slug: doc.slug,
        sources: resolveSources(doc.sources, sourceMap),
        startDate: doc.startDate,
        summary: typeof doc.summary === 'string' ? doc.summary : '',
        title: doc.title,
      } satisfies CampaignRecord
    })
    .filter(isPresent)
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
      relatedEvents: campaign.relatedEvents.map((slug) => eventMapBySlug.get(slug)!).filter(Boolean),
      relatedPlaces: campaign.relatedPlaces.map((slug) => placeMapBySlug.get(slug)!).filter(Boolean),
      slug: campaign.slug,
      sources: campaign.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
      startDate: campaign.startDate,
      summary: campaign.summary,
      title: campaign.title,
    }))
  const campaigns = [...payloadCampaigns, ...supplementalCampaigns]
  const campaignMapById = new Map(campaigns.map((campaign) => [campaign.id, campaign]))
  const campaignMapBySlug = new Map(campaigns.map((campaign) => [campaign.slug, campaign]))

  const payloadOverlays: OverlayRecord[] = raw.overlayDocs
    .map<OverlayRecord | null>((doc) => {
      const period = resolveMapItem(doc.period, periodMapById, periodMapBySlug)

      if (!period) {
        return null
      }

      const relatedCampaign = resolveMapItem(doc.relatedCampaign, campaignMapById, campaignMapBySlug)?.slug
      const relatedEvent = resolveMapItem(doc.relatedEvent, eventMapById, eventMapBySlug)?.slug

      return {
        color: typeof doc.color === 'string' ? doc.color : '#ab2f24',
        historicalGeometry: doc.historicalGeometry ?? { coordinates: [105.8, 21.02], type: 'Point' },
        id: String(doc._id),
        layerGroup: doc.layerGroup ?? 'historical_overlays',
        layerKind: doc.layerKind,
        opacity: typeof doc.opacity === 'number' ? doc.opacity : 0.35,
        period,
        region: doc.region,
        relatedCampaign,
        relatedEvent,
        slug: doc.slug,
        sources: resolveSources(doc.sources, sourceMap),
        summary: typeof doc.summary === 'string' ? doc.summary : '',
        title: doc.title,
        validFrom: doc.validFrom,
        validTo: typeof doc.validTo === 'string' ? doc.validTo : undefined,
      } satisfies OverlayRecord
    })
    .filter(isPresent)
  const supplementalOverlays: OverlayRecord[] = demoHistoricalOverlays
    .filter((overlay) => !payloadOverlays.some((item) => item.slug === overlay.slug))
    .map((overlay) => ({
      ...overlay,
      id: makeRecordId('overlay', overlay.slug),
      period: periodMapBySlug.get(overlay.period)!,
      sources: overlay.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
    }))
  const overlays = [...payloadOverlays, ...supplementalOverlays]

  const payloadQuizzes: QuizRecord[] = raw.quizDocs
    .map<QuizRecord | null>((doc) => {
      const period = resolveMapItem(doc.period, periodMapById, periodMapBySlug)

      if (!period) {
        return null
      }

      return {
        id: String(doc._id),
        period,
        questions: Array.isArray(doc.questions)
          ? doc.questions
              .filter((question: any) => typeof question?.prompt === 'string')
              .map((question: any) => ({
                explanation: typeof question.explanation === 'string' ? question.explanation : '',
                options: Array.isArray(question.options)
                  ? question.options
                      .filter((option: any) => typeof option?.label === 'string')
                      .map((option: any) => ({
                        isCorrect: Boolean(option.isCorrect),
                        label: option.label,
                      }))
                  : [],
                prompt: question.prompt,
              }))
          : [],
        relatedCampaigns: relationIds(doc.relatedCampaigns)
          .map((item) => campaignMapById.get(item) ?? campaignMapBySlug.get(item))
          .filter((item): item is CampaignRecord => Boolean(item)),
        relatedEvents: relationIds(doc.relatedEvents)
          .map((item) => eventMapById.get(item) ?? eventMapBySlug.get(item))
          .filter((item): item is EventRecord => Boolean(item)),
        slug: doc.slug,
        sources: resolveSources(doc.sources, sourceMap),
        summary: typeof doc.summary === 'string' ? doc.summary : '',
        title: doc.title,
      } satisfies QuizRecord
    })
    .filter(isPresent)
  const supplementalQuizzes: QuizRecord[] = mergedDemoQuizzes
    .filter((quiz) => !payloadQuizzes.some((item) => item.slug === quiz.slug))
    .map((quiz) => ({
      ...quiz,
      id: makeRecordId('quiz', quiz.slug),
      period: periodMapBySlug.get(quiz.period)!,
      relatedCampaigns: quiz.relatedCampaigns.map((slug) => campaignMapBySlug.get(slug)!).filter(Boolean),
      relatedEvents: quiz.relatedEvents.map((slug) => eventMapBySlug.get(slug)!).filter(Boolean),
      sources: quiz.sources.map((slug) => sourceMap.get(slug)!).filter(Boolean),
    }))
  const quizzes = [...payloadQuizzes, ...supplementalQuizzes]

  const snapshot: ExplorerSnapshot = {
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

  return {
    raw,
    snapshot,
  }
}

function issuesForYear(snapshot: ExplorerSnapshot, year: number, issues: AuditIssue[]) {
  const filtered = filterSnapshot(snapshot, { layer: 'all', type: 'all', year })

  if (filtered.activeYear !== year) {
    issues.push({
      code: 'active-year-mismatch',
      context: `year=${year}`,
      detail: `activeYear=${filtered.activeYear ?? 'null'}`,
      severity: 'error',
    })
  }

  if (!filtered.activeBoundaryEpoch) {
    issues.push({
      code: 'missing-boundary-epoch',
      context: `year=${year}`,
      detail: 'Không tìm được boundary epoch cho năm đang lọc.',
      severity: 'error',
    })
  } else if (year < filtered.activeBoundaryEpoch.validFromYear || year > filtered.activeBoundaryEpoch.validToYear) {
    issues.push({
      code: 'boundary-range-mismatch',
      context: `year=${year}`,
      detail: `${filtered.activeBoundaryEpoch.slug} (${filtered.activeBoundaryEpoch.validFromYear}-${filtered.activeBoundaryEpoch.validToYear})`,
      severity: 'error',
    })
  }

  for (const event of filtered.events) {
    if (!isWithinYear(year, event.startDate, event.endDate) && event.displayYear !== year) {
      issues.push({
        code: 'event-year-violation',
        context: `year=${year} event=${event.slug}`,
        detail: `displayYear=${event.displayYear} start=${event.startDate} end=${event.endDate ?? ''}`,
        severity: 'error',
      })
    }
  }

  for (const campaign of filtered.campaigns) {
    if (!isWithinYear(year, campaign.startDate, campaign.endDate) && campaign.displayYear !== year) {
      issues.push({
        code: 'campaign-year-violation',
        context: `year=${year} campaign=${campaign.slug}`,
        detail: `displayYear=${campaign.displayYear} start=${campaign.startDate} end=${campaign.endDate ?? ''}`,
        severity: 'error',
      })
    }
  }

  for (const place of filtered.places) {
    if (year < place.period.startYear || year > place.period.endYear) {
      issues.push({
        code: 'place-year-violation',
        context: `year=${year} place=${place.slug}`,
        detail: `${place.period.startYear}-${place.period.endYear}`,
        severity: 'error',
      })
    }
  }

  for (const overlay of filtered.overlays) {
    if (!isWithinYear(year, overlay.validFrom, overlay.validTo)) {
      issues.push({
        code: 'overlay-year-violation',
        context: `year=${year} overlay=${overlay.slug}`,
        detail: `${overlay.validFrom} -> ${overlay.validTo ?? ''}`,
        severity: 'error',
      })
    }
  }

  for (const quiz of filtered.quizzes) {
    if (year < quiz.period.startYear || year > quiz.period.endYear) {
      issues.push({
        code: 'quiz-year-violation',
        context: `year=${year} quiz=${quiz.slug}`,
        detail: `${quiz.period.startYear}-${quiz.period.endYear}`,
        severity: 'error',
      })
    }
  }
}

function issuesForPeriods(snapshot: ExplorerSnapshot, issues: AuditIssue[]) {
  for (const period of snapshot.periods) {
    const filtered = filterSnapshot(snapshot, { layer: 'all', period: period.slug, type: 'all' })

    if (filtered.activeYear == null || filtered.activeYear < period.startYear || filtered.activeYear > period.endYear) {
      issues.push({
        code: 'period-active-year-out-of-range',
        context: `period=${period.slug}`,
        detail: `activeYear=${filtered.activeYear ?? 'null'} period=${period.startYear}-${period.endYear}`,
        severity: 'error',
      })
    }

    const invalidRecords = [
      ...filtered.events.filter((event) => event.period.slug !== period.slug),
      ...filtered.campaigns.filter((campaign) => campaign.period.slug !== period.slug),
      ...filtered.places.filter((place) => place.period.slug !== period.slug),
      ...filtered.overlays.filter((overlay) => overlay.period.slug !== period.slug),
      ...filtered.quizzes.filter((quiz) => quiz.period.slug !== period.slug),
    ]

    for (const record of invalidRecords) {
      issues.push({
        code: 'period-filter-violation',
        context: `period=${period.slug}`,
        detail: `record=${record.slug}`,
        severity: 'error',
      })
    }
  }
}

function issuesForLeaders(snapshot: ExplorerSnapshot, issues: AuditIssue[]) {
  for (const leader of snapshot.leaders) {
    const filtered = filterSnapshot(snapshot, { layer: 'all', leader: leader.slug, type: 'all' })
    const terms = leader.terms?.length
      ? leader.terms
      : [{ endYear: leader.endYear, label: leader.tenureLabel ?? leader.officeLabel, startYear: leader.startYear }]
    const coversActiveYear =
      typeof filtered.activeYear === 'number' &&
      terms.some((term) => filtered.activeYear! >= term.startYear && filtered.activeYear! <= term.endYear)

    if (!coversActiveYear) {
      issues.push({
        code: 'leader-active-year-out-of-term',
        context: `leader=${leader.slug}`,
        detail: `activeYear=${filtered.activeYear ?? 'null'} terms=${terms.map((term) => `${term.startYear}-${term.endYear}`).join(', ')}`,
        severity: 'error',
      })
    }

    if (
      filtered.activeBoundaryEpoch &&
      typeof filtered.activeYear === 'number' &&
      (filtered.activeYear < filtered.activeBoundaryEpoch.validFromYear ||
        filtered.activeYear > filtered.activeBoundaryEpoch.validToYear)
    ) {
      issues.push({
        code: 'leader-boundary-mismatch',
        context: `leader=${leader.slug}`,
        detail: `${filtered.activeBoundaryEpoch.slug} activeYear=${filtered.activeYear}`,
        severity: 'error',
      })
    }
  }
}

function issuesForRegions(snapshot: ExplorerSnapshot, issues: AuditIssue[]) {
  for (const region of allRegions) {
    const filtered = filterSnapshot(snapshot, { layer: 'all', region, type: 'all' })

    for (const event of filtered.events) {
      if (event.region !== region) {
        issues.push({
          code: 'region-filter-violation',
          context: `region=${region}`,
          detail: `event=${event.slug} actual=${event.region}`,
          severity: 'error',
        })
      }
    }

    for (const campaign of filtered.campaigns) {
      if (campaign.region !== region) {
        issues.push({
          code: 'region-filter-violation',
          context: `region=${region}`,
          detail: `campaign=${campaign.slug} actual=${campaign.region}`,
          severity: 'error',
        })
      }
    }

    for (const place of filtered.places) {
      if (place.region !== region) {
        issues.push({
          code: 'region-filter-violation',
          context: `region=${region}`,
          detail: `place=${place.slug} actual=${place.region}`,
          severity: 'error',
        })
      }
    }

    for (const overlay of filtered.overlays) {
      if (overlay.region !== region) {
        issues.push({
          code: 'region-filter-violation',
          context: `region=${region}`,
          detail: `overlay=${overlay.slug} actual=${overlay.region}`,
          severity: 'error',
        })
      }
    }
  }
}

function issuesForSearch(snapshot: ExplorerSnapshot, issues: AuditIssue[]) {
  const records: ExplorerRecord[] = [...snapshot.events, ...snapshot.campaigns, ...snapshot.places]

  for (const record of records) {
    const query = normalizeSearchText(record.title)
    const filtered = filterSnapshot(snapshot, { layer: 'all', q: query, type: 'all' })
    const matches = [...filtered.events, ...filtered.campaigns, ...filtered.places].some(
      (candidate) => candidate.slug === record.slug,
    )

    if (!matches) {
      issues.push({
        code: 'search-normalization-miss',
        context: `record=${record.slug}`,
        detail: `query=${query}`,
        severity: 'error',
      })
    }
  }
}

function issuesForMapDisplay(snapshot: ExplorerSnapshot, issues: AuditIssue[]) {
  for (const type of allTypes) {
    const filtered = filterSnapshot(snapshot, { layer: 'all', type })
    const records =
      type === 'events'
        ? filtered.events
        : type === 'campaigns'
          ? filtered.campaigns
          : type === 'places'
            ? filtered.places
            : [...filtered.events, ...filtered.campaigns, ...filtered.places]

    for (const record of records) {
      if (!recordHasMapPoint(record)) {
        issues.push({
          code: 'record-missing-map-point',
          context: `type=${type}`,
          detail: record.slug,
          severity: 'warning',
        })
      }
    }
  }
}

async function main() {
  const { raw, snapshot } = await buildDirectSnapshot()
  const issues: AuditIssue[] = []
  const minYear = Math.min(
    ...snapshot.periods.map((period) => period.startYear),
    ...snapshot.boundaryEpochs.map((epoch) => epoch.validFromYear),
  )
  const maxYear = Math.max(
    ...snapshot.periods.map((period) => period.endYear),
    ...snapshot.boundaryEpochs.map((epoch) => epoch.validToYear),
  )

  for (let year = minYear; year <= maxYear; year += 1) {
    issuesForYear(snapshot, year, issues)
  }

  issuesForPeriods(snapshot, issues)
  issuesForLeaders(snapshot, issues)
  issuesForRegions(snapshot, issues)
  issuesForSearch(snapshot, issues)
  issuesForMapDisplay(snapshot, issues)

  const errorCount = issues.filter((issue) => issue.severity === 'error').length
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length
  const missingMapPointRecords = [...snapshot.events, ...snapshot.campaigns, ...snapshot.places]
    .filter((record) => !recordHasMapPoint(record))
    .map((record) => record.slug)
    .sort((left, right) => left.localeCompare(right, 'vi'))

  console.log(
    JSON.stringify(
      {
        counts: {
          adminUnits: snapshot.adminUnits.length,
          boundaryEpochs: snapshot.boundaryEpochs.length,
          campaigns: snapshot.campaigns.length,
          events: snapshot.events.length,
          leaders: snapshot.leaders.length,
          overlays: snapshot.overlays.length,
          periods: snapshot.periods.length,
          places: snapshot.places.length,
          quizzes: snapshot.quizzes.length,
          sources: snapshot.sources.length,
        },
        rawCounts: {
          boundaryEpochDocs: raw.boundaryEpochDocs.length,
          campaignDocs: raw.campaignDocs.length,
          eventDocs: raw.eventDocs.length,
          leaderDocs: raw.leaderDocs.length,
          overlayDocs: raw.overlayDocs.length,
          periodDocs: raw.periodDocs.length,
          placeDocs: raw.placeDocs.length,
          quizDocs: raw.quizDocs.length,
          sourceDocs: raw.sourceDocs.length,
          unitDocs: raw.unitDocs.length,
        },
        summary: {
          errorCount,
          maxYear,
          minYear,
          missingMapPointCount: missingMapPointRecords.length,
          warningCount,
        },
        missingMapPointRecords,
        issues,
      },
      null,
      2,
    ),
  )

  if (errorCount > 0) {
    process.exitCode = 1
  }
}

await main()
