import type { Response } from 'express'

import { getExplorerSnapshot } from './content-service.js'

const GAME_ID = 'party-history-rush'
const GAME_TITLE = 'Đường đua lịch sử Đảng'
const GAME_SUMMARY =
  'Một đường đua hỏi nhanh về lịch sử Đảng. Người chơi nhập username, trả lời liên tiếp các câu hỏi và leo hạng theo điểm số cùng thời gian hoàn thành.'
const LEADERBOARD_LIMIT = 12
const QUESTION_LIMIT = 10
const QUESTION_CACHE_TTL_MS = 5 * 60_000

type PartyGameQuestion = {
  correctIndex: number
  explanation: string
  id: string
  options: { label: string }[]
  periodTitle: string
  prompt: string
  quizSlug: string
  quizTitle: string
}

type StoredScoreEntry = {
  durationMs: number
  score: number
  submittedAt: string
  totalQuestions: number
  username: string
}

type RankedScoreEntry = StoredScoreEntry & {
  rank: number
}

type LeaderboardPayload = {
  leaderboard: RankedScoreEntry[]
  onlineCount: number
  updatedAt: string
}

type PartyGamePayload = LeaderboardPayload & {
  gameId: string
  questionCount: number
  questions: PartyGameQuestion[]
  summary: string
  title: string
}

type SubmitScoreInput = {
  durationMs: number
  score: number
  username: string
}

type StreamClient = {
  id: string
  res: Response
}

let cachedQuestions:
  | {
      expiresAt: number
      questions: PartyGameQuestion[]
    }
  | null = null
let lastUpdatedAt = new Date().toISOString()

const leaderboardEntries = new Map<string, StoredScoreEntry>()
const streamClients = new Map<string, StreamClient>()

function normalizeUsernameKey(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function sanitizeUsername(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 24)
}

function compareEntries(left: StoredScoreEntry, right: StoredScoreEntry) {
  if (left.score !== right.score) {
    return right.score - left.score
  }

  if (left.durationMs !== right.durationMs) {
    return left.durationMs - right.durationMs
  }

  if (left.submittedAt !== right.submittedAt) {
    return left.submittedAt.localeCompare(right.submittedAt)
  }

  return left.username.localeCompare(right.username, 'vi')
}

function rankLeaderboard(): RankedScoreEntry[] {
  return [...leaderboardEntries.values()]
    .sort(compareEntries)
    .slice(0, LEADERBOARD_LIMIT)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}

function currentLeaderboardPayload(): LeaderboardPayload {
  return {
    leaderboard: rankLeaderboard(),
    onlineCount: streamClients.size,
    updatedAt: lastUpdatedAt,
  }
}

function sendSseEvent(res: Response, event: string, payload: unknown) {
  res.write(`event: ${event}\n`)
  res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

function broadcastLeaderboard() {
  const payload = currentLeaderboardPayload()

  for (const client of streamClients.values()) {
    sendSseEvent(client.res, 'leaderboard', payload)
  }
}

async function buildGameQuestions() {
  const snapshot = await getExplorerSnapshot()
  const seenPrompts = new Set<string>()

  return snapshot.quizzes
    .sort(
      (left, right) =>
        left.period.startYear - right.period.startYear || left.title.localeCompare(right.title, 'vi'),
    )
    .flatMap((quiz) =>
      quiz.questions.map((question, index) => ({
        correctIndex: question.options.findIndex((option) => option.isCorrect),
        explanation: question.explanation,
        id: `${quiz.slug}:${index}`,
        options: question.options.map((option) => ({ label: option.label })),
        periodTitle: quiz.period.title,
        prompt: question.prompt,
        quizSlug: quiz.slug,
        quizTitle: quiz.title,
      })),
    )
    .filter((question) => question.correctIndex >= 0 && question.options.length >= 2)
    .filter((question) => {
      const normalizedPrompt = question.prompt.trim().toLowerCase()

      if (!normalizedPrompt || seenPrompts.has(normalizedPrompt)) {
        return false
      }

      seenPrompts.add(normalizedPrompt)
      return true
    })
    .slice(0, QUESTION_LIMIT)
}

async function getGameQuestions() {
  const now = Date.now()

  if (cachedQuestions && cachedQuestions.expiresAt > now) {
    return cachedQuestions.questions
  }

  const questions = await buildGameQuestions()
  cachedQuestions = {
    expiresAt: now + QUESTION_CACHE_TTL_MS,
    questions,
  }

  return questions
}

export async function getPartyHistoryGame(): Promise<PartyGamePayload> {
  const questions = await getGameQuestions()

  return {
    gameId: GAME_ID,
    questionCount: questions.length,
    questions,
    summary: GAME_SUMMARY,
    title: GAME_TITLE,
    ...currentLeaderboardPayload(),
  }
}

export async function submitPartyHistoryScore(input: SubmitScoreInput) {
  const username = sanitizeUsername(input.username)

  if (username.length < 2) {
    throw new Error('Username cần ít nhất 2 ký tự.')
  }

  const questions = await getGameQuestions()

  if (questions.length === 0) {
    throw new Error('Game hiện chưa có bộ câu hỏi để mở bảng xếp hạng.')
  }

  const totalQuestions = questions.length
  const rawScore = Number.isFinite(input.score) ? input.score : 0
  const rawDurationMs = Number.isFinite(input.durationMs) ? input.durationMs : 1_000
  const score = Math.max(0, Math.min(totalQuestions, Math.round(rawScore)))
  const durationMs = Math.max(1_000, Math.min(30 * 60_000, Math.round(rawDurationMs)))
  const submittedAt = new Date().toISOString()
  const entry: StoredScoreEntry = {
    durationMs,
    score,
    submittedAt,
    totalQuestions,
    username,
  }
  const key = normalizeUsernameKey(username)
  const current = leaderboardEntries.get(key)
  const shouldReplace = !current || compareEntries(entry, current) < 0

  if (shouldReplace) {
    leaderboardEntries.set(key, entry)
    lastUpdatedAt = submittedAt
    broadcastLeaderboard()
  }

  const leaderboard = rankLeaderboard()
  const rankedEntry = leaderboard.find((item) => normalizeUsernameKey(item.username) === key) ?? null

  return {
    accepted: shouldReplace,
    entry: rankedEntry,
    leaderboard,
    onlineCount: streamClients.size,
    updatedAt: lastUpdatedAt,
  }
}

export function openPartyHistoryLeaderboardStream(res: Response) {
  const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const heartbeat = setInterval(() => {
    res.write(': ping\n\n')
  }, 20_000)

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders?.()

  const client: StreamClient = {
    id: clientId,
    res,
  }

  streamClients.set(clientId, client)
  sendSseEvent(res, 'leaderboard', currentLeaderboardPayload())
  broadcastLeaderboard()

  return () => {
    clearInterval(heartbeat)
    streamClients.delete(clientId)
    broadcastLeaderboard()
    res.end()
  }
}
