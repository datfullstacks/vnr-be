import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  publishedOnlyOrAuthenticated,
} from '../access.js'
import {
  editorialStateField,
  ensurePublishReadiness,
  sourcesField,
  summaryField,
  versionedContent,
} from '../editorial.js'
import { slugHook } from '../slug.js'

export const Leaders: CollectionConfig = {
  slug: 'leaders',
  admin: {
    defaultColumns: ['name', 'officeLabel', 'startYear', 'endYear', 'editorialState'],
    useAsTitle: 'name',
  },
  access: {
    create: canManageContent,
    delete: canDeleteContent,
    read: publishedOnlyOrAuthenticated,
    update: canManageContent,
  },
  fields: [
    {
      name: 'name',
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
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Optional display title shown on cards and detail pages.',
      },
    },
    summaryField,
    editorialStateField,
    {
      name: 'overview',
      type: 'textarea',
      required: true,
    },
    {
      name: 'officeLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'officeType',
      type: 'select',
      defaultValue: 'general-secretary',
      options: [
        { label: 'General Secretary', value: 'general-secretary' },
        { label: 'Party Chairman', value: 'party-chairman' },
      ],
      required: true,
    },
    {
      name: 'portrait',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'portraitUrl',
      type: 'text',
      admin: {
        description: 'Used when portrait is served from a static path or external URL.',
      },
    },
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
      name: 'tenureLabel',
      type: 'text',
    },
    {
      name: 'isFeaturedChairmanHighlight',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'terms',
      type: 'array',
      fields: [
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
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
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
      name: 'relatedPlaces',
      type: 'relationship',
      hasMany: true,
      relationTo: 'places',
    },
    {
      name: 'relatedQuizzes',
      type: 'relationship',
      hasMany: true,
      relationTo: 'quizzes',
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness()],
  },
  versions: versionedContent,
}
