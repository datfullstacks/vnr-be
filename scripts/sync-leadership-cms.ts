import 'dotenv/config'

import { getPayload } from 'payload'
import { createLocalReq } from 'payload'

import payloadConfig from '../payload.config.js'
import { demoPeriods, demoSources } from '../src/data/demo-content.js'
import { supplementalLeaderCopyBySlug, supplementalLeaderPresentationBySlug } from '../src/data/leader-detail-backfills.js'
import {
  demoLeaders,
  leaderContentReferencesBySlug,
  periodMetadataBySlug,
  supplementalPeriods,
} from '../src/data/leader-content.js'
import { lexicalFromPlainText } from '../src/lib/richtext.js'

const overwrite = process.argv.includes('--overwrite')

type SlugDoc = {
  id: string
  slug: string
  [key: string]: unknown
}

function periodOverviewPayload(value: string) {
  return lexicalFromPlainText(value)
}

async function findAllBySlug(payload: Awaited<ReturnType<typeof getPayload>>, collection: string, req: any) {
  const result = await payload.find({
    collection: collection as any,
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    req,
  })

  return new Map<string, SlugDoc>(result.docs.map((doc: any) => [doc.slug, { ...doc, id: String(doc.id) }]))
}

async function createOrUpdateBySlug(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: string,
  existingBySlug: Map<string, SlugDoc>,
  slug: string,
  data: Record<string, unknown>,
  req: any,
) {
  const existing = existingBySlug.get(slug)

  if (!existing) {
    const created = await payload.create({
      collection: collection as any,
      data,
      depth: 0,
      overrideAccess: true,
      req,
    })

    existingBySlug.set(slug, { ...(created as Record<string, unknown>), id: String(created.id), slug })
    return 'created'
  }

  await payload.update({
    id: existing.id,
    collection: collection as any,
    data,
    depth: 0,
    overrideAccess: true,
    req,
  })

  return 'updated'
}

function pickLeaderData(
  leader: (typeof demoLeaders)[number],
  ids: {
    campaigns: Map<string, SlugDoc>
    events: Map<string, SlugDoc>
    places: Map<string, SlugDoc>
    quizzes: Map<string, SlugDoc>
    sources: Map<string, SlugDoc>
  },
) {
  const copyOverride = supplementalLeaderCopyBySlug[leader.slug]
  const presentationOverride = supplementalLeaderPresentationBySlug[leader.slug]
  const refs = leaderContentReferencesBySlug[leader.slug]

  return {
    _status: 'published',
    displayName: presentationOverride?.displayName ?? undefined,
    endYear: leader.endYear,
    isFeaturedChairmanHighlight: Boolean(leader.isFeaturedChairmanHighlight),
    name: leader.name,
    officeLabel: presentationOverride?.officeLabel ?? leader.officeLabel,
    officeType: leader.officeType,
    overview: copyOverride?.overview ?? leader.overview,
    portraitUrl: leader.portraitUrl ?? undefined,
    relatedCampaigns:
      refs?.campaignSlugs
        ?.map((slug) => ids.campaigns.get(slug)?.id)
        .filter((id): id is string => Boolean(id)) ?? [],
    relatedEvents:
      refs?.eventSlugs
        ?.map((slug) => ids.events.get(slug)?.id)
        .filter((id): id is string => Boolean(id)) ?? [],
    relatedPlaces:
      refs?.placeSlugs
        ?.map((slug) => ids.places.get(slug)?.id)
        .filter((id): id is string => Boolean(id)) ?? [],
    relatedQuizzes:
      refs?.quizSlugs
        ?.map((slug) => ids.quizzes.get(slug)?.id)
        .filter((id): id is string => Boolean(id)) ?? [],
    slug: leader.slug,
    sources: leader.sources
      .map((slug) => ids.sources.get(slug)?.id)
      .filter((id): id is string => Boolean(id)),
    startYear: leader.startYear,
    summary: presentationOverride?.summary ?? copyOverride?.summary ?? leader.summary,
    tenureLabel: presentationOverride?.tenureLabel ?? undefined,
    terms: presentationOverride?.terms ?? [],
  }
}

function mergeIfNeeded(existing: SlugDoc, next: Record<string, unknown>) {
  if (overwrite) {
    return next
  }

  const merged: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(next)) {
    const current = existing[key]

    if (Array.isArray(value)) {
      const currentArray = Array.isArray(current) ? current : []
      merged[key] = currentArray.length > 0 ? currentArray : value
      continue
    }

    if (current === undefined || current === null || current === '') {
      merged[key] = value
    }
  }

  return merged
}

async function main() {
  const payload = await getPayload({ config: payloadConfig })
  const req = await createLocalReq({ context: { seed: true } }, payload)

  const [sourcesBySlug, periodsBySlug, leadersBySlug, eventsBySlug, campaignsBySlug, placesBySlug, quizzesBySlug] =
    await Promise.all([
      findAllBySlug(payload, 'sources', req),
      findAllBySlug(payload, 'periods', req),
      findAllBySlug(payload, 'leaders', req),
      findAllBySlug(payload, 'events', req),
      findAllBySlug(payload, 'campaigns', req),
      findAllBySlug(payload, 'places', req),
      findAllBySlug(payload, 'quizzes', req),
    ])

  let createdSources = 0
  let updatedSources = 0
  for (const source of demoSources) {
    const status = await createOrUpdateBySlug(
      payload,
      'sources',
      sourcesBySlug,
      source.slug,
      {
        ...source,
        _status: 'published',
      },
      req,
    )

    if (status === 'created') {
      createdSources += 1
    } else if (overwrite) {
      updatedSources += 1
    }
  }

  let createdLeaders = 0
  let updatedLeaders = 0
  for (const leader of demoLeaders) {
    const existing = leadersBySlug.get(leader.slug)
    const data = pickLeaderData(leader, {
      campaigns: campaignsBySlug,
      events: eventsBySlug,
      places: placesBySlug,
      quizzes: quizzesBySlug,
      sources: sourcesBySlug,
    })
    const payloadData = existing ? mergeIfNeeded(existing, data) : data

    if (Object.keys(payloadData).length === 0) {
      continue
    }

    const status = await createOrUpdateBySlug(payload, 'leaders', leadersBySlug, leader.slug, payloadData, req)
    if (status === 'created') {
      createdLeaders += 1
    } else {
      updatedLeaders += 1
    }
  }

  const refreshedLeadersBySlug = await findAllBySlug(payload, 'leaders', req)
  const periodSeeds = [...demoPeriods, ...supplementalPeriods].map((period) => {
    const metadata = periodMetadataBySlug[period.slug]
    return {
      _status: 'published',
      accentColor: period.accentColor,
      displayOrder: metadata?.displayOrder ?? period.startYear,
      endYear: period.endYear,
      featuredLeader: metadata?.featuredLeaderSlug
        ? refreshedLeadersBySlug.get(metadata.featuredLeaderSlug)?.id
        : undefined,
      keyThemes: period.keyThemes,
      leadershipLabel: metadata?.leadershipLabel ?? undefined,
      officialLeaders:
        metadata?.officialLeaderSlugs
          ?.map((slug) => refreshedLeadersBySlug.get(slug)?.id)
          .filter((id): id is string => Boolean(id)) ?? [],
      overview: periodOverviewPayload(period.overview),
      periodType: metadata?.periodType ?? 'party-era',
      slug: period.slug,
      startYear: period.startYear,
      summary: period.summary,
      title: period.title,
    }
  })

  let createdPeriods = 0
  let updatedPeriods = 0
  for (const period of periodSeeds) {
    const existing = periodsBySlug.get(period.slug)
    const data = existing ? mergeIfNeeded(existing, period) : period

    if (Object.keys(data).length === 0) {
      continue
    }

    const status = await createOrUpdateBySlug(payload, 'periods', periodsBySlug, period.slug, data, req)
    if (status === 'created') {
      createdPeriods += 1
    } else {
      updatedPeriods += 1
    }
  }

  console.log(
    JSON.stringify(
      {
        createdLeaders,
        createdPeriods,
        createdSources,
        overwrite,
        updatedLeaders,
        updatedPeriods,
        updatedSources,
      },
      null,
      2,
    ),
  )

  await payload.destroy()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
