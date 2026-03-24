import express from 'express'

const router = express.Router()

router.get('/', (_req, res) => {
  res.json({
    name: 'vnr-be',
    status: 'ok',
  })
})

export default router
