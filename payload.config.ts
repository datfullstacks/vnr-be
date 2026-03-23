import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { BoundaryEpochs } from '@/payload/collections/BoundaryEpochs'
import { Campaigns } from '@/payload/collections/Campaigns'
import { Events } from '@/payload/collections/Events'
import { requireMongoConnectionString } from '@/lib/storage-config'
import { HistoricalAdminUnits } from '@/payload/collections/HistoricalAdminUnits'
import { HistoricalOverlays } from '@/payload/collections/HistoricalOverlays'
import { Media } from '@/payload/collections/Media'
import { Periods } from '@/payload/collections/Periods'
import { Places } from '@/payload/collections/Places'
import { Quizzes } from '@/payload/collections/Quizzes'
import { Sources } from '@/payload/collections/Sources'
import { Users } from '@/payload/collections/Users'

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

  return 'http://localhost:3001'
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
