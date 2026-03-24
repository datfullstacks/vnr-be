#!/usr/bin/env node

import http from 'node:http'

import debugFactory from 'debug'

import app from '../app.js'

const debug = debugFactory('vnr-be:server')
const port = normalizePort(process.env.PORT || '3001')

app.set('port', port)

const server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(value: string) {
  const parsedPort = Number.parseInt(value, 10)

  if (Number.isNaN(parsedPort)) {
    return value
  }

  if (parsedPort >= 0) {
    return parsedPort
  }

  throw new Error(`Invalid port: ${value}`)
}

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`)
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`)
    default:
      throw error
  }
}

function onListening() {
  const address = server.address()
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`
  debug(`Listening on ${bind}`)
  console.log(`VNR BE listening on ${bind}`)
}
