import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  publishedOnlyOrAuthenticated,
} from '@/payload/access'
import {
  editorialStateField,
  ensurePublishReadiness,
  summaryField,
  versionedContent,
} from '@/payload/editorial'
import { slugHook } from '@/payload/slug'

export const Periods: CollectionConfig = {
  slug: 'periods',
  admin: {
    defaultColumns: ['title', 'startYear', 'endYear', 'editorialState'],
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
    {
      name: 'startYear',
      type: 'number',
      required: true,
    },
    {
      name: 'endYear',
      type: 'number',
      required: true,
    },
    {
      name: 'accentColor',
      type: 'text',
      defaultValue: '#ab2f24',
      required: true,
    },
    {
      name: 'overview',
      type: 'richText',
      required: true,
    },
    {
      name: 'keyThemes',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness({ requireSources: false })],
  },
  versions: versionedContent,
}
