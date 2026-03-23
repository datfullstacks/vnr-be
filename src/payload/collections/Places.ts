import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  publishedOnlyOrAuthenticated,
} from '@/payload/access'
import {
  editorialStateField,
  ensurePublishReadiness,
  historicalGeometryField,
  modernLocationField,
  periodField,
  regionField,
  sourcesField,
  summaryField,
  versionedContent,
} from '@/payload/editorial'
import { slugHook } from '@/payload/slug'

export const Places: CollectionConfig = {
  slug: 'places',
  admin: {
    defaultColumns: ['title', 'region', 'updatedAt'],
    useAsTitle: 'title',
  },
  access: {
    create: canManageContent,
    delete: canDeleteContent,
    read: publishedOnlyOrAuthenticated,
    update: canManageContent,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
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
    regionField,
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    modernLocationField,
    historicalGeometryField,
    {
      name: 'featuredMedia',
      type: 'relationship',
      relationTo: 'media',
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness({ requireLocation: true })],
  },
  versions: versionedContent,
}
