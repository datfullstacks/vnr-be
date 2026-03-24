import 'dotenv/config'

import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'

import indexRouter from './routes/index.js'
import publicRouter from './routes/public.js'

const app = express()

app.use(logger('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/api/public', publicRouter)

app.use((_req, _res, next) => {
  next(createError(404))
})

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  })
})

export default app
