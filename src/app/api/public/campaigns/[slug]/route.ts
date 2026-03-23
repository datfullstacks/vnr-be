import { NextResponse } from 'next/server'

import { getCampaign } from '@/lib/content-service'
import { apiErrorResponse } from '@/lib/public-api'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const campaign = await getCampaign(slug)

    if (!campaign) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

