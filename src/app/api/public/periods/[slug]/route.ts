import { NextResponse } from 'next/server'

import { getPeriod } from '@/lib/content-service'
import { apiErrorResponse } from '@/lib/public-api'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const period = await getPeriod(slug)

    if (!period.period) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(period)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

