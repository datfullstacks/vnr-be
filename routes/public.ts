import express from 'express'

import {
  getCampaign,
  getEvent,
  getExplorerData,
  getExplorerSnapshot,
  getLeader,
  getLeaders,
  getPeriod,
  getPlace,
  getQuiz,
} from '../src/lib/content-service.js'
import {
  canResetPartyHistoryLeaderboard,
  getPartyHistoryGame,
  openPartyHistoryLeaderboardStream,
  resetPartyHistoryLeaderboard,
  submitPartyHistoryScore,
} from '../src/lib/party-game-service.js'

const router = express.Router()

router.get('/snapshot', async (_req, res, next) => {
  try {
    const snapshot = await getExplorerSnapshot()
    res.json(snapshot)
  } catch (error) {
    next(error)
  }
})

router.get('/explorer', async (req, res, next) => {
  try {
    const data = await getExplorerData(req.query as Record<string, string | string[] | undefined>)
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/leaders', async (_req, res, next) => {
  try {
    const leaders = await getLeaders()
    res.json(leaders)
  } catch (error) {
    next(error)
  }
})

router.get('/leaders/:slug', async (req, res, next) => {
  try {
    const leader = await getLeader(req.params.slug)

    if (!leader) {
      res.status(404).json({ error: 'Leader not found' })
      return
    }

    res.json(leader)
  } catch (error) {
    next(error)
  }
})

router.get('/periods/:slug', async (req, res, next) => {
  try {
    const period = await getPeriod(req.params.slug)

    if (!period.period) {
      res.status(404).json({ error: 'Period not found' })
      return
    }

    res.json(period)
  } catch (error) {
    next(error)
  }
})

router.get('/events/:slug', async (req, res, next) => {
  try {
    const event = await getEvent(req.params.slug)

    if (!event) {
      res.status(404).json({ error: 'Event not found' })
      return
    }

    res.json(event)
  } catch (error) {
    next(error)
  }
})

router.get('/campaigns/:slug', async (req, res, next) => {
  try {
    const campaign = await getCampaign(req.params.slug)

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' })
      return
    }

    res.json(campaign)
  } catch (error) {
    next(error)
  }
})

router.get('/places/:slug', async (req, res, next) => {
  try {
    const place = await getPlace(req.params.slug)

    if (!place) {
      res.status(404).json({ error: 'Place not found' })
      return
    }

    res.json(place)
  } catch (error) {
    next(error)
  }
})

router.get('/quizzes/:slug', async (req, res, next) => {
  try {
    const quiz = await getQuiz(req.params.slug)

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' })
      return
    }

    res.json(quiz)
  } catch (error) {
    next(error)
  }
})

router.get('/games/party-history-rush', async (_req, res, next) => {
  try {
    const game = await getPartyHistoryGame()
    res.json(game)
  } catch (error) {
    next(error)
  }
})

router.post('/games/party-history-rush/submit', async (req, res, next) => {
  try {
    const result = await submitPartyHistoryScore({
      durationMs: Number(req.body?.durationMs),
      score: Number(req.body?.score),
      username: String(req.body?.username ?? ''),
    })
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/games/party-history-rush/stream', async (req, res, next) => {
  try {
    const cleanup = openPartyHistoryLeaderboardStream(res)
    req.on('close', cleanup)
  } catch (error) {
    next(error)
  }
})

router.post('/games/party-history-rush/reset', async (req, res, next) => {
  try {
    const resetToken = req.header('x-party-game-reset-token')

    if (!canResetPartyHistoryLeaderboard(resetToken)) {
      res.status(403).json({ error: 'Reset token không hợp lệ.' })
      return
    }

    const result = resetPartyHistoryLeaderboard()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

export default router
