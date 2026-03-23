import { NextResponse } from 'next/server'

import { getExplorerData } from '@/lib/content-service'
import { apiErrorResponse, searchParamsToRecord } from '@/lib/public-api'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const data = await getExplorerData(searchParamsToRecord(url.searchParams))
    return NextResponse.json(data)
  } catch (error) {
    return apiErrorResponse(error)
  }
}

