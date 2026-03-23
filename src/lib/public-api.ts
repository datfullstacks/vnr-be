import { NextResponse } from 'next/server'

export function searchParamsToRecord(searchParams: URLSearchParams) {
  const result: Record<string, string | string[] | undefined> = {}

  for (const [key, value] of searchParams.entries()) {
    const existing = result[key]

    if (typeof existing === 'undefined') {
      result[key] = value
      continue
    }

    if (Array.isArray(existing)) {
      existing.push(value)
      result[key] = existing
      continue
    }

    result[key] = [existing, value]
  }

  return result
}

export function apiErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown backend error'

  return NextResponse.json(
    {
      error: message,
    },
    {
      status: 500,
    },
  )
}

