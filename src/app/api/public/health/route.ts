import { NextResponse } from 'next/server'

import { getMongoConnectionString, isDemoFallbackEnabled } from '@/lib/storage-config'

export async function GET() {
  return NextResponse.json({
    fallbackDemoEnabled: isDemoFallbackEnabled(),
    mongoConfigured: Boolean(getMongoConnectionString()),
    ok: true,
    service: 'vnr-be',
    time: new Date().toISOString(),
  })
}
