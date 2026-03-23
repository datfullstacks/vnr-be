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

export const Quizzes: CollectionConfig = {
  slug: 'quizzes',
  admin: {
    defaultColumns: ['title', 'period', 'updatedAt'],
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
    {
      name: 'relatedEvents',
      type: 'relationship',
      hasMany: true,
      relationTo: 'events',
    },
    {
      name: 'relatedCampaigns',
      type: 'relationship',
      hasMany: true,
      relationTo: 'campaigns',
    },
    {
      name: 'questions',
      type: 'array',
      fields: [
        {
          name: 'prompt',
          type: 'textarea',
          required: true,
        },
        {
          name: 'explanation',
          type: 'textarea',
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'isCorrect',
              type: 'checkbox',
              required: true,
            },
          ],
          minRows: 2,
          required: true,
        },
      ],
      required: true,
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness()],
  },
  versions: versionedContent,
}
