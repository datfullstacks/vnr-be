import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { BoundaryEpochs } from './src/payload/collections/BoundaryEpochs.js'
import { Campaigns } from './src/payload/collections/Campaigns.js'
import { Events } from './src/payload/collections/Events.js'
import { requireMongoConnectionString } from './src/lib/storage-config.js'
import { HistoricalAdminUnits } from './src/payload/collections/HistoricalAdminUnits.js'
import { HistoricalOverlays } from './src/payload/collections/HistoricalOverlays.js'
import { Media } from './src/payload/collections/Media.js'
import { Periods } from './src/payload/collections/Periods.js'
import { Places } from './src/payload/collections/Places.js'
import { Quizzes } from './src/payload/collections/Quizzes.js'
import { Sources } from './src/payload/collections/Sources.js'
import { Users } from './src/payload/collections/Users.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const enableS3 =
  Boolean(process.env.S3_BUCKET) &&
  Boolean(process.env.S3_REGION) &&
  Boolean(process.env.S3_ACCESS_KEY_ID) &&
  Boolean(process.env.S3_SECRET_ACCESS_KEY)

function resolveServerUrl() {
  const configuredUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL?.trim()

  if (configuredUrl) {
    return configuredUrl
  }

  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()

  if (vercelProductionUrl) {
    return `https://${vercelProductionUrl.replace(/^https?:\/\//, '')}`
  }

  const vercelUrl = process.env.VERCEL_URL?.trim()

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, '')}`
  }

  return 'http://localhost:3000'
}

const serverUrl = resolveServerUrl()

export default buildConfig({
  admin: {
    importMap: {
      baseDir: dirname,
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Sources,
    Periods,
    HistoricalAdminUnits,
    BoundaryEpochs,
    Places,
    Events,
    Campaigns,
    HistoricalOverlays,
    Quizzes,
  ],
  cors: [serverUrl],
  csrf: [serverUrl],
  db: mongooseAdapter({
    url: requireMongoConnectionString(),
  }),
  editor: lexicalEditor(),
  plugins: [
    ...(enableS3
      ? [
          s3Storage({
            bucket: process.env.S3_BUCKET!,
            collections: {
              media: true,
            },
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
              endpoint: process.env.S3_ENDPOINT || undefined,
              forcePathStyle: Boolean(process.env.S3_ENDPOINT),
              region: process.env.S3_REGION!,
            },
            enabled: true,
          }),
        ]
      : []),
  ],
  sharp,
  secret: process.env.PAYLOAD_SECRET || 'replace-me-in-production',
  serverURL: serverUrl,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
