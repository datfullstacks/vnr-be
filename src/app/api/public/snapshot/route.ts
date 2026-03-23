import { NextResponse } from 'next/server'

import { getExplorerSnapshot } from '@/lib/content-service'
import { apiErrorResponse } from '@/lib/public-api'

export async function GET() {
  try {
    const snapshot = await getExplorerSnapshot()
    return NextResponse.json(snapshot)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

