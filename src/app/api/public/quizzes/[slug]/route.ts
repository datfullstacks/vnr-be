import { NextResponse } from 'next/server'

import { getQuiz } from '@/lib/content-service'
import { apiErrorResponse } from '@/lib/public-api'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const quiz = await getQuiz(slug)

    if (!quiz) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    return apiErrorResponse(error)
  }
}
