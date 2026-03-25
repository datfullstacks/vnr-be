import type { FeatureCollection, Point } from 'geojson'

export type RecordRegion = 'central' | 'interregional' | 'international' | 'north' | 'south'

export type DatePrecision = 'approximate' | 'day' | 'month' | 'range' | 'year'
export type HistoricalBoundaryChangeType = 'base' | 'carried' | 'merge' | 'reorganized' | 'split'
export type HistoricalBoundaryUnitType =
  | 'historical_region'
  | 'merged_province'
  | 'municipality'
  | 'province'
export type LeaderOfficeType = 'general-secretary' | 'party-chairman'
export type PeriodType = 'formation' | 'party-era'
export type LeaderTermRecord = {
  endYear: number
  label: string
  startYear: number
}

export type SourceRecord = {
  author?: string
  bibliography: string
  id: string
  license: string
  publisher?: string
  reliability: 'primary' | 'reference' | 'secondary'
  slug: string
  sourceType: string
  summary: string
  title: string
  url?: string
  year: number
}

export type LeaderRecord = {
  displayName?: string
  endYear: number
  id: string
  isFeaturedChairmanHighlight?: boolean
  name: string
  officeLabel: string
  officeType: LeaderOfficeType
  overview: string
  portraitUrl?: string
  slug: string
  sources: SourceRecord[]
  startYear: number
  summary: string
  tenureLabel?: string
  terms?: LeaderTermRecord[]
}

export type PeriodRecord = {
  accentColor: string
  displayOrder: number
  endYear: number
  featuredLeaderSlug?: string
  id: string
  keyThemes: string[]
  leadershipLabel?: string
  officialLeaderSlugs: string[]
  overview: string
  periodType: PeriodType
  slug: string
  startYear: number
  summary: string
  title: string
}

export type ModernLocation = {
  label?: string
  latitude?: number
  longitude?: number
  province?: string
}

export type PlaceRecord = {
  body: string
  featuredMediaUrl?: string
  historicalGeometry?: Record<string, unknown>
  id: string
  modernLocation?: ModernLocation
  period: PeriodRecord
  region: RecordRegion
  slug: string
  sources: SourceRecord[]
  summary: string
  title: string
}

export type EventRecord = {
  content: string
  datePrecision: DatePrecision
  displayYear: number
  endDate?: string
  historicalGeometry?: Record<string, unknown>
  id: string
  mediaUrls: string[]
  modernLocation?: ModernLocation
  period: PeriodRecord
  places: PlaceRecord[]
  region: RecordRegion
  slug: string
  sources: SourceRecord[]
  startDate: string
  summary: string
  title: string
  topics: string[]
}

export type CampaignRecord = {
  body: string
  datePrecision: DatePrecision
  displayYear: number
  endDate?: string
  historicalGeometry?: Record<string, unknown>
  id: string
  mediaUrls: string[]
  modernLocation?: ModernLocation
  outcome: string
  period: PeriodRecord
  region: RecordRegion
  relatedEvents: EventRecord[]
  relatedPlaces: PlaceRecord[]
  slug: string
  sources: SourceRecord[]
  startDate: string
  summary: string
  title: string
}

export type OverlayRecord = {
  color: string
  historicalGeometry: Record<string, unknown>
  id: string
  layerGroup: 'historical_overlays'
  layerKind: 'base' | 'front' | 'point' | 'region' | 'route'
  opacity: number
  period: PeriodRecord
  region: RecordRegion
  relatedCampaign?: string
  relatedEvent?: string
  slug: string
  sources: SourceRecord[]
  summary: string
  title: string
  validFrom: string
  validTo?: string
}

export type HistoricalAdminUnitRecord = {
  canonicalSlug: string
  changeSlug: string
  changeType: HistoricalBoundaryChangeType
  changeYear: number
  displayColor: string
  id: string
  labelPoint?: ModernLocation
  memberProvinceSlugs: string[]
  predecessorCanonicalSlugs: string[]
  slug: string
  sources: SourceRecord[]
  summary: string
  title: string
  unitType: HistoricalBoundaryUnitType
  validFromYear: number
  validToYear: number
}

export type BoundaryEpochRecord = {
  boundaryFeatures: FeatureCollection
  id: string
  labelFeatures: FeatureCollection<Point>
  slug: string
  sources: SourceRecord[]
  summary: string
  title: string
  units: HistoricalAdminUnitRecord[]
  validFromYear: number
  validToYear: number
}

export type QuizRecord = {
  id: string
  period: PeriodRecord
  questions: {
    explanation: string
    options: { isCorrect: boolean; label: string }[]
    prompt: string
  }[]
  relatedCampaigns: CampaignRecord[]
  relatedEvents: EventRecord[]
  slug: string
  sources: SourceRecord[]
  summary: string
  title: string
}

export type ExplorerRecord = CampaignRecord | EventRecord | PlaceRecord

export type ExplorerSnapshot = {
  activeBoundaryEpoch?: BoundaryEpochRecord | null
  activeLeader?: LeaderRecord | null
  activeYear?: number
  adminUnits: HistoricalAdminUnitRecord[]
  boundaryEpochs: BoundaryEpochRecord[]
  campaigns: CampaignRecord[]
  events: EventRecord[]
  leaders: LeaderRecord[]
  overlays: OverlayRecord[]
  periods: PeriodRecord[]
  places: PlaceRecord[]
  quizzes: QuizRecord[]
  sources: SourceRecord[]
}
