import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import {
  demoCampaigns,
  demoEvents,
  demoHistoricalOverlays,
  demoPeriods,
  demoPlaces,
  demoQuizzes,
  demoSources,
} from '../src/data/demo-content'
import { indexBySlug } from '../src/lib/demo-index'
import { buildHistoricalBoundaryBundle } from '../src/lib/historical-boundaries'
import { lexicalFromPlainText } from '../src/lib/richtext'

function loadEnvFile(fileName: string, override = false) {
  const filePath = path.resolve(process.cwd(), fileName)

  if (!fs.existsSync(filePath)) {
    return
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()

    if (!override && key in process.env) {
      continue
    }

    process.env[key] = value
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local', true)

async function upsertBySlug({
  collection,
  payload,
  data,
}: {
  collection: string
  data: Record<string, unknown>
  payload: Awaited<ReturnType<typeof getPayload>>
}): Promise<{ id: number | string; slug: string }> {
  const slug = String(data.slug)
  const existing = await payload.find({
    collection: collection as any,
    context: {
      seed: true,
    },
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (existing.docs[0]?.id) {
    const doc = await payload.update({
      id: existing.docs[0].id,
      collection: collection as any,
      context: {
        seed: true,
      },
      data,
      overrideAccess: true,
    })
    return {
      id: doc.id,
      slug,
    }
  }

  const doc = await payload.create({
    collection: collection as any,
    context: {
      seed: true,
    },
    data,
    overrideAccess: true,
  })
  return {
    id: doc.id,
    slug,
  }
}

async function upsertMany<T>({
  items,
  mapper,
}: {
  items: T[]
  mapper: (item: T) => Promise<{ id: number | string; slug: string }>
}) {
  const results: Array<{ id: number | string; slug: string }> = []

  for (const item of items) {
    results.push(await mapper(item))
  }

  return results
}

async function pruneCollectionBySlugs({
  collection,
  keepSlugs,
  payload,
}: {
  collection: string
  keepSlugs: Set<string>
  payload: Awaited<ReturnType<typeof getPayload>>
}) {
  const existing = await payload.find({
    collection: collection as any,
    context: {
      seed: true,
    },
    depth: 0,
    limit: 2000,
    pagination: false,
  })

  for (const doc of existing.docs) {
    const slug = typeof doc.slug === 'string' ? doc.slug : null

    if (!slug || keepSlugs.has(slug)) {
      continue
    }

    await payload.delete({
      id: doc.id,
      collection: collection as any,
      context: {
        seed: true,
      },
      overrideAccess: true,
    })
  }
}

async function main() {
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })
  const { epochs: boundaryEpochs, units: historicalAdminUnits } = buildHistoricalBoundaryBundle()

  const sourceIndex = indexBySlug(
    await upsertMany({
      items: demoSources,
      mapper: (source) =>
        upsertBySlug({
          collection: 'sources',
          data: {
            ...source,
            _status: 'published',
          },
          payload,
        }),
    }),
  )

  const periodIndex = indexBySlug(
    await upsertMany({
      items: demoPeriods,
      mapper: (period) =>
        upsertBySlug({
          collection: 'periods',
          data: {
            ...period,
            _status: 'published',
            overview: lexicalFromPlainText(period.overview),
          },
          payload,
      }),
    }),
  )

  await pruneCollectionBySlugs({
    collection: 'boundary-epochs',
    keepSlugs: new Set(boundaryEpochs.map((epoch) => epoch.slug)),
    payload,
  })
  await pruneCollectionBySlugs({
    collection: 'historical-admin-units',
    keepSlugs: new Set(historicalAdminUnits.map((unit) => unit.slug)),
    payload,
  })

  const adminUnitIndex = indexBySlug(
    await upsertMany({
      items: historicalAdminUnits,
      mapper: (unit) =>
        upsertBySlug({
          collection: 'historical-admin-units',
          data: {
            _status: 'published',
            canonicalSlug: unit.canonicalSlug,
            changeSlug: unit.changeSlug,
            changeType: unit.changeType,
            changeYear: unit.changeYear,
            displayColor: unit.displayColor,
            labelPoint: unit.labelPoint,
            memberProvinceSlugs: unit.memberProvinceSlugs.map((slug) => ({ slug })),
            predecessorCanonicalSlugs: unit.predecessorCanonicalSlugs.map((slug) => ({ slug })),
            slug: unit.slug,
            sources: unit.sourceSlugs.map((slug) => sourceIndex[slug]),
            summary: unit.summary,
            title: unit.title,
            unitType: unit.unitType,
            validFromYear: unit.validFromYear,
            validToYear: unit.validToYear,
          },
          payload,
        }),
    }),
  )

  await upsertMany({
    items: boundaryEpochs,
    mapper: (epoch) =>
      upsertBySlug({
        collection: 'boundary-epochs',
        data: {
          _status: 'published',
          boundaryFeatures: epoch.boundaryFeatures,
          labelFeatures: epoch.labelFeatures,
          slug: epoch.slug,
          sources: epoch.sourceSlugs.map((slug) => sourceIndex[slug]),
          summary: epoch.summary,
          title: epoch.title,
          units: epoch.unitSlugs.map((slug) => adminUnitIndex[slug]),
          validFromYear: epoch.validFromYear,
          validToYear: epoch.validToYear,
        },
        payload,
      }),
  })

  const placeIndex = indexBySlug(
    await upsertMany({
      items: demoPlaces,
      mapper: (place) =>
        upsertBySlug({
          collection: 'places',
          data: {
            ...place,
            _status: 'published',
            body: lexicalFromPlainText(place.body),
            period: periodIndex[place.period],
            sources: place.sources.map((slug) => sourceIndex[slug]),
          },
          payload,
        }),
    }),
  )

  const eventIndex = indexBySlug(
    await upsertMany({
      items: demoEvents,
      mapper: (event) =>
        upsertBySlug({
          collection: 'events',
          data: {
            ...event,
            _status: 'published',
            content: lexicalFromPlainText(event.content),
            period: periodIndex[event.period],
            sources: event.sources.map((slug) => sourceIndex[slug]),
            places: event.places.map((slug) => placeIndex[slug]),
          },
          payload,
        }),
    }),
  )

  const campaignIndex = indexBySlug(
    await upsertMany({
      items: demoCampaigns,
      mapper: (campaign) =>
        upsertBySlug({
          collection: 'campaigns',
          data: {
            ...campaign,
            _status: 'published',
            body: lexicalFromPlainText(campaign.body),
            period: periodIndex[campaign.period],
            sources: campaign.sources.map((slug) => sourceIndex[slug]),
            relatedEvents: campaign.relatedEvents.map((slug) => eventIndex[slug]),
            relatedPlaces: campaign.relatedPlaces.map((slug) => placeIndex[slug]),
          },
          payload,
        }),
    }),
  )

  await upsertMany({
    items: demoHistoricalOverlays,
    mapper: (overlay) =>
      upsertBySlug({
        collection: 'historical-overlays',
        data: {
          ...overlay,
          _status: 'published',
          period: periodIndex[overlay.period],
          relatedCampaign: overlay.relatedCampaign
            ? campaignIndex[overlay.relatedCampaign]
            : undefined,
          relatedEvent: overlay.relatedEvent ? eventIndex[overlay.relatedEvent] : undefined,
          sources: overlay.sources.map((slug) => sourceIndex[slug]),
        },
        payload,
      }),
  })

  await upsertMany({
    items: demoQuizzes,
    mapper: (quiz) =>
      upsertBySlug({
        collection: 'quizzes',
        data: {
          ...quiz,
          _status: 'published',
          period: periodIndex[quiz.period],
          relatedEvents: quiz.relatedEvents.map((slug) => eventIndex[slug]),
          relatedCampaigns: quiz.relatedCampaigns.map((slug) => campaignIndex[slug]),
          sources: quiz.sources.map((slug) => sourceIndex[slug]),
        },
        payload,
      }),
  })

  console.log('Seeded demo content successfully.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
