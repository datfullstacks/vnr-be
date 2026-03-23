import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  publishedOnlyOrAuthenticated,
} from '@/payload/access'
import {
  editorialStateField,
  ensurePublishReadiness,
  periodField,
  sourcesField,
  summaryField,
  versionedContent,
} from '@/payload/editorial'
import { slugHook } from '@/payload/slug'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'caption', 'license', 'updatedAt'],
    useAsTitle: 'caption',
  },
  access: {
    create: canManageContent,
    delete: canDeleteContent,
    read: publishedOnlyOrAuthenticated,
    update: canManageContent,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [slugHook],
      },
      index: true,
      required: true,
      unique: true,
    },
    summaryField,
    editorialStateField,
    periodField,
    {
      name: 'caption',
      type: 'text',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
      required: true,
    },
    {
      name: 'license',
      type: 'text',
      required: true,
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness()],
  },
  upload: {
    imageSizes: [
      {
        height: 1200,
        name: 'hero',
        width: 1600,
      },
      {
        height: 720,
        name: 'card',
        width: 1080,
      },
    ],
    staticDir: path.resolve(dirname, '../../../media'),
  },
  versions: versionedContent,
}
