import fs from 'node:fs'
import path from 'node:path'

import type { Feature, FeatureCollection, Geometry, MultiPolygon, Point, Polygon } from 'geojson'

import {
  demoBoundaryTransitions,
  type DemoBoundaryTransition,
  type DemoBoundaryUnitChange,
} from '@/data/demo-content'
import type { HistoricalBoundaryChangeType, HistoricalBoundaryUnitType } from '@/lib/content-types'

type ModernBoundaryFeature = Feature<
  Polygon | MultiPolygon,
  {
    center?: [number, number]
    id: string
    slug: string
    title: string
  }
>

type HistoricalUnitState = {
  canonicalSlug: string
  displayColor: string
  lastChangedBySlug: string
  lastChangedByYear: number
  lastChangeType: Exclude<HistoricalBoundaryChangeType, 'carried'>
  memberProvinceSlugs: string[]
  predecessorCanonicalSlugs: string[]
  predecessorTitles: string[]
  summary?: string
  title: string
  unitType: HistoricalBoundaryUnitType
}

export type GeneratedHistoricalAdminUnit = {
  canonicalSlug: string
  changeSlug: string
  changeType: HistoricalBoundaryChangeType
  changeYear: number
  displayColor: string
  labelPoint: { latitude: number; longitude: number }
  memberProvinceSlugs: string[]
  predecessorCanonicalSlugs: string[]
  slug: string
  sourceSlugs: string[]
  summary: string
  title: string
  unitType: HistoricalBoundaryUnitType
  validFromYear: number
  validToYear: number
}

export type GeneratedBoundaryEpoch = {
  boundaryFeatures: FeatureCollection
  id: string
  labelFeatures: FeatureCollection<Point>
  slug: string
  sourceSlugs: string[]
  summary: string
  title: string
  unitSlugs: string[]
  validFromYear: number
  validToYear: number
}

type GeneratedBoundaryBundle = {
  epochs: GeneratedBoundaryEpoch[]
  units: GeneratedHistoricalAdminUnit[]
}

let modernBoundaryCache: ModernBoundaryFeature[] | null = null
let boundaryBundleCache: GeneratedBoundaryBundle | null = null

const palette = [
  '#ab5f32',
  '#8f7047',
  '#6b7e59',
  '#7a5d75',
  '#4f7a7d',
  '#8b4f4f',
  '#b38348',
  '#5f6d8d',
]

function getModernBoundaries() {
  if (modernBoundaryCache) {
    return modernBoundaryCache
  }

  const filePath = path.resolve(process.cwd(), 'public/data/modern-boundaries.geojson')
  const geojson = JSON.parse(fs.readFileSync(filePath, 'utf8')) as FeatureCollection
  modernBoundaryCache = geojson.features as ModernBoundaryFeature[]
  return modernBoundaryCache
}

function colorForSlug(slug: string) {
  let hash = 0

  for (const character of slug) {
    hash = (hash * 31 + character.charCodeAt(0)) % palette.length
  }

  return palette[hash]
}

function cloneGeometry<T extends Geometry>(geometry: T): T {
  return JSON.parse(JSON.stringify(geometry)) as T
}

function cloneState(unit: HistoricalUnitState): HistoricalUnitState {
  return {
    ...unit,
    memberProvinceSlugs: [...unit.memberProvinceSlugs],
    predecessorCanonicalSlugs: [...unit.predecessorCanonicalSlugs],
    predecessorTitles: [...unit.predecessorTitles],
  }
}

function collectPolygonCoordinates(geometry: Polygon | MultiPolygon) {
  if (geometry.type === 'Polygon') {
    return [cloneGeometry(geometry).coordinates]
  }

  return cloneGeometry(geometry).coordinates
}

function averagePoint(points: Array<[number, number]>) {
  const total = points.reduce(
    (accumulator, [longitude, latitude]) => {
      accumulator.longitude += longitude
      accumulator.latitude += latitude
      return accumulator
    },
    { latitude: 0, longitude: 0 },
  )

  return {
    latitude: total.latitude / points.length,
    longitude: total.longitude / points.length,
  }
}

function provinceTitleForSlug(slug: string) {
  return getModernBoundaries().find((feature) => feature.properties.slug === slug)?.properties.title ?? slug
}

function normalizeMembers(memberProvinceSlugs: string[], provinceMap: Map<string, ModernBoundaryFeature>) {
  const uniqueMembers = [...new Set(memberProvinceSlugs)]

  for (const slug of uniqueMembers) {
    if (!provinceMap.has(slug)) {
      throw new Error(`Unknown province slug "${slug}" in historical boundary transition.`)
    }
  }

  return uniqueMembers.sort((left, right) => left.localeCompare(right, 'vi'))
}

function expandTransitionChanges(
  transition: DemoBoundaryTransition,
  provinceMap: Map<string, ModernBoundaryFeature>,
) {
  const coveredProvinceSlugs = new Set(
    transition.changes.flatMap((change) => change.memberProvinceSlugs),
  )
  const restoreProvinceSlugs = transition.restoreAllProvinces
    ? [...provinceMap.keys()]
    : transition.restoreProvinceSlugs ?? []
  const restoreChanges: DemoBoundaryUnitChange[] = [...new Set(restoreProvinceSlugs)]
    .filter((slug) => !coveredProvinceSlugs.has(slug))
    .map((slug) => {
      const province = provinceMap.get(slug)

      if (!province) {
        throw new Error(`Unknown province slug "${slug}" in restoreProvinceSlugs.`)
      }

      return {
        memberProvinceSlugs: [slug],
        slug,
        title: province.properties.title,
        unitType: 'province',
      }
    })

  return [...transition.changes, ...restoreChanges]
}

function overlapsMembers(left: string[], right: string[]) {
  const rightSet = new Set(right)
  return left.some((slug) => rightSet.has(slug))
}

function sameMembers(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false
  }

  return left.every((slug, index) => slug === right[index])
}

function resolveChangeType(
  predecessors: HistoricalUnitState[],
  memberProvinceSlugs: string[],
  canonicalSlug: string,
): Exclude<HistoricalBoundaryChangeType, 'carried'> {
  if (predecessors.length === 0) {
    return 'base'
  }

  if (predecessors.length > 1) {
    return 'merge'
  }

  const [predecessor] = predecessors

  if (predecessor.memberProvinceSlugs.length > memberProvinceSlugs.length) {
    return 'split'
  }

  if (
    predecessor.canonicalSlug !== canonicalSlug ||
    !sameMembers(predecessor.memberProvinceSlugs, memberProvinceSlugs)
  ) {
    return 'reorganized'
  }

  return predecessor.lastChangeType
}

function resolveDisplayColor(change: DemoBoundaryUnitChange, predecessors: HistoricalUnitState[]) {
  if (change.displayColor) {
    return change.displayColor
  }

  const sameSlugPredecessor = predecessors.find((unit) => unit.canonicalSlug === change.slug)

  if (sameSlugPredecessor) {
    return sameSlugPredecessor.displayColor
  }

  if (predecessors.length === 1) {
    return predecessors[0].displayColor
  }

  return colorForSlug(change.slug)
}

function resolveUnitType(change: DemoBoundaryUnitChange) {
  if (change.unitType) {
    return change.unitType
  }

  return change.memberProvinceSlugs.length > 1 ? 'merged_province' : 'province'
}

function stateUnitSummary(unit: HistoricalUnitState, transition: DemoBoundaryTransition, validToYear: number) {
  if (unit.summary) {
    return unit.summary
  }

  if (unit.lastChangedBySlug === transition.slug) {
    const predecessors = unit.predecessorTitles.join(', ')
    const memberTitles = unit.memberProvinceSlugs.map(provinceTitleForSlug).join(', ')

    if (transition.restoreAllProvinces && unit.lastChangeType === 'merge') {
      return `${unit.title} được hợp từ ${memberTitles} từ năm ${transition.validFromYear}.`
    }

    if (unit.lastChangeType === 'merge' && predecessors) {
      return `${unit.title} được hợp từ ${predecessors} từ năm ${transition.validFromYear}.`
    }

    if (unit.lastChangeType === 'split' && predecessors) {
      return `${unit.title} được tách ra từ ${predecessors} từ năm ${transition.validFromYear}.`
    }

    if (unit.lastChangeType === 'reorganized' && predecessors) {
      return `${unit.title} được điều chỉnh từ ${predecessors} trong đợt thay đổi năm ${transition.validFromYear}.`
    }
  }

  return `${unit.title} trong lớp ranh giới hiệu lực ${transition.validFromYear}-${validToYear}.`
}

function createBaseState(initialTransition: DemoBoundaryTransition): Map<string, HistoricalUnitState> {
  const provinceFeatures = getModernBoundaries()

  return new Map<string, HistoricalUnitState>(
    provinceFeatures.map((province) => [
      province.properties.slug,
      {
        canonicalSlug: province.properties.slug,
        displayColor: colorForSlug(province.properties.slug),
        lastChangedBySlug: initialTransition.slug,
        lastChangedByYear: initialTransition.validFromYear,
        lastChangeType: 'base',
        memberProvinceSlugs: [province.properties.slug],
        predecessorCanonicalSlugs: [],
        predecessorTitles: [],
        title: province.properties.title,
        unitType: 'province',
      } satisfies HistoricalUnitState,
    ]),
  )
}

function validateStateCoverage(
  state: Map<string, HistoricalUnitState>,
  provinceMap: Map<string, ModernBoundaryFeature>,
  transitionSlug: string,
) {
  const coverage = new Map<string, number>()

  for (const unit of state.values()) {
    for (const provinceSlug of unit.memberProvinceSlugs) {
      coverage.set(provinceSlug, (coverage.get(provinceSlug) ?? 0) + 1)
    }
  }

  const duplicates = [...coverage.entries()].filter(([, count]) => count > 1).map(([slug]) => slug)
  const missing = [...provinceMap.keys()].filter((slug) => !coverage.has(slug))

  if (duplicates.length > 0 || missing.length > 0) {
    throw new Error(
      `Historical boundary transition "${transitionSlug}" has invalid province coverage. Missing: ${
        missing.join(', ') || 'none'
      }; duplicates: ${duplicates.join(', ') || 'none'}.`,
    )
  }
}

function applyTransition(
  previousState: Map<string, HistoricalUnitState>,
  transition: DemoBoundaryTransition,
  provinceMap: Map<string, ModernBoundaryFeature>,
) {
  const nextState = new Map(
    [...previousState.entries()].map(([slug, unit]) => [slug, cloneState(unit)]),
  )

  for (const change of expandTransitionChanges(transition, provinceMap)) {
    const memberProvinceSlugs = normalizeMembers(change.memberProvinceSlugs, provinceMap)
    const predecessors = [...previousState.values()].filter((unit) =>
      overlapsMembers(unit.memberProvinceSlugs, memberProvinceSlugs),
    )
    const forcedChangeType =
      transition.restoreAllProvinces && change.unitType !== 'historical_region'
        ? memberProvinceSlugs.length > 1
          ? 'merge'
          : 'split'
        : undefined

    for (const predecessor of predecessors) {
      nextState.delete(predecessor.canonicalSlug)
    }

    nextState.set(change.slug, {
      canonicalSlug: change.slug,
      displayColor: resolveDisplayColor(change, predecessors),
      lastChangedBySlug: transition.slug,
      lastChangedByYear: transition.validFromYear,
      lastChangeType:
        forcedChangeType ?? resolveChangeType(predecessors, memberProvinceSlugs, change.slug),
      memberProvinceSlugs,
      predecessorCanonicalSlugs: predecessors.map((unit) => unit.canonicalSlug).sort((left, right) =>
        left.localeCompare(right, 'vi'),
      ),
      predecessorTitles: predecessors
        .map((unit) => unit.title)
        .sort((left, right) => left.localeCompare(right, 'vi')),
      summary: change.summary,
      title: change.title,
      unitType: resolveUnitType(change),
    })
  }

  validateStateCoverage(nextState, provinceMap, transition.slug)
  return nextState
}

function labelPointForMembers(
  memberProvinceSlugs: string[],
  provinceMap: Map<string, ModernBoundaryFeature>,
) {
  const centers = memberProvinceSlugs
    .map((slug) => provinceMap.get(slug)?.properties.center)
    .filter(Boolean) as Array<[number, number]>

  if (centers.length === 0) {
    return { latitude: 21.0, longitude: 105.8 }
  }

  return averagePoint(centers)
}

function materializeEpochUnits(
  transition: DemoBoundaryTransition,
  validToYear: number,
  state: Map<string, HistoricalUnitState>,
  provinceMap: Map<string, ModernBoundaryFeature>,
) {
  return [...state.values()]
    .map((unit) => {
      const labelPoint = labelPointForMembers(unit.memberProvinceSlugs, provinceMap)
      const changedInEpoch = unit.lastChangedBySlug === transition.slug

      return {
        canonicalSlug: unit.canonicalSlug,
        changeSlug: unit.lastChangedBySlug,
        changeType: changedInEpoch ? unit.lastChangeType : 'carried',
        changeYear: unit.lastChangedByYear,
        displayColor: unit.displayColor,
        labelPoint,
        memberProvinceSlugs: [...unit.memberProvinceSlugs],
        predecessorCanonicalSlugs: changedInEpoch ? [...unit.predecessorCanonicalSlugs] : [],
        slug: `${transition.slug}-${unit.canonicalSlug}`,
        sourceSlugs: transition.sources,
        summary: stateUnitSummary(unit, transition, validToYear),
        title: unit.title,
        unitType: unit.unitType,
        validFromYear: transition.validFromYear,
        validToYear,
      } satisfies GeneratedHistoricalAdminUnit
    })
    .sort((left, right) => left.title.localeCompare(right.title, 'vi'))
}

function buildUnitFeature(
  unit: GeneratedHistoricalAdminUnit,
  provinceMap: Map<string, ModernBoundaryFeature>,
) {
  const memberFeatures = unit.memberProvinceSlugs
    .map((slug) => provinceMap.get(slug))
    .filter(Boolean) as ModernBoundaryFeature[]

  const polygons = memberFeatures.flatMap((feature) => collectPolygonCoordinates(feature.geometry))
  const geometry =
    polygons.length === 1
      ? ({
          coordinates: polygons[0],
          type: 'Polygon',
        } satisfies Polygon)
      : ({
          coordinates: polygons,
          type: 'MultiPolygon',
        } satisfies MultiPolygon)

  return {
    geometry,
    properties: {
      canonicalSlug: unit.canonicalSlug,
      changeSlug: unit.changeSlug,
      changeType: unit.changeType,
      changeYear: unit.changeYear,
      color: unit.displayColor,
      kind: 'historical-admin-unit',
      memberProvinceSlugs: unit.memberProvinceSlugs,
      predecessorCanonicalSlugs: unit.predecessorCanonicalSlugs,
      provinceCount: unit.memberProvinceSlugs.length,
      summary: unit.summary,
      title: unit.title,
      unitSlug: unit.slug,
      unitType: unit.unitType,
      validFromYear: unit.validFromYear,
      validToYear: unit.validToYear,
    },
    type: 'Feature',
  } satisfies Feature
}

function buildLabelFeature(unit: GeneratedHistoricalAdminUnit) {
  return {
    geometry: {
      coordinates: [unit.labelPoint.longitude, unit.labelPoint.latitude],
      type: 'Point',
    },
    properties: {
      canonicalSlug: unit.canonicalSlug,
      title: unit.title,
      unitSlug: unit.slug,
    },
    type: 'Feature',
  } satisfies Feature<Point>
}

function resolveValidToYear(transitions: DemoBoundaryTransition[], index: number) {
  const nextTransition = transitions[index + 1]

  if (nextTransition) {
    return nextTransition.validFromYear - 1
  }

  return Math.max(new Date().getUTCFullYear(), transitions[index].validFromYear)
}

function resolveTransitionMetadata(transition: DemoBoundaryTransition) {
  if (transition.slug === '1858-1944-regions') {
    return {
      summary:
        'Trước 1945, bản đồ không hiển thị tên tỉnh hiện đại mà chuyển sang các không gian lịch sử lớn: Bắc Kỳ, Trung Kỳ, Nam Kỳ. Đây là lớp bối cảnh xấp xỉ dùng các mảnh SVG tỉnh hiện có.',
      title: '1858-1944: Bắc Kỳ - Trung Kỳ - Nam Kỳ',
    }
  }

  return {
    summary: transition.summary,
    title: transition.title,
  }
}

export function buildHistoricalBoundaryBundle() {
  if (boundaryBundleCache) {
    return boundaryBundleCache
  }

  const transitions = [...demoBoundaryTransitions].sort(
    (left, right) => left.validFromYear - right.validFromYear,
  )

  if (transitions.length === 0) {
    boundaryBundleCache = { epochs: [], units: [] }
    return boundaryBundleCache
  }

  const provinceFeatures = getModernBoundaries()
  const provinceMap = new Map(provinceFeatures.map((feature) => [feature.properties.slug, feature]))
  let state = createBaseState(transitions[0])
  const units: GeneratedHistoricalAdminUnit[] = []
  const epochs: GeneratedBoundaryEpoch[] = []

  transitions.forEach((transition, index) => {
    if (index > 0 || transition.changes.length > 0) {
      state = applyTransition(state, transition, provinceMap)
    }

    const validToYear = resolveValidToYear(transitions, index)
    const epochUnits = materializeEpochUnits(transition, validToYear, state, provinceMap)
    const metadata = resolveTransitionMetadata(transition)

    units.push(...epochUnits)
    epochs.push({
      boundaryFeatures: {
        features: epochUnits.map((unit) => buildUnitFeature(unit, provinceMap)),
        type: 'FeatureCollection',
      },
      id: `boundary-epoch:${index + 1}`,
      labelFeatures: {
        features: epochUnits.map(buildLabelFeature),
        type: 'FeatureCollection',
      },
      slug: transition.slug,
      sourceSlugs: transition.sources,
      summary: metadata.summary,
      title: metadata.title,
      unitSlugs: epochUnits.map((unit) => unit.slug),
      validFromYear: transition.validFromYear,
      validToYear,
    })
  })

  boundaryBundleCache = { epochs, units }
  return boundaryBundleCache
}

export function findBoundaryEpochForYear<T extends { validFromYear: number; validToYear: number }>(
  epochs: T[],
  year: number,
) {
  return (
    [...epochs]
      .filter((epoch) => epoch.validFromYear <= year && epoch.validToYear >= year)
      .sort(
        (left, right) =>
          right.validFromYear - left.validFromYear || left.validToYear - right.validToYear,
      )
      .at(0) ?? null
  )
}
