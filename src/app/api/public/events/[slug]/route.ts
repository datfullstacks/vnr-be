import { NextResponse } from 'next/server'

import { getEvent } from '@/lib/content-service'
import { apiErrorResponse } from '@/lib/public-api'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const event = await getEvent(slug)

    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

