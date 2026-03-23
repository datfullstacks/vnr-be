import { NextResponse } from 'next/server'

import { getPlace } from '@/lib/content-service'
import { apiErrorResponse } from '@/lib/public-api'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const place = await getPlace(slug)

    if (!place) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(place)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

