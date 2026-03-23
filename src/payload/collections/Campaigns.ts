import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  publishedOnlyOrAuthenticated,
} from '@/payload/access'
import {
  dateFields,
  displayYearField,
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

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  admin: {
    defaultColumns: ['title', 'startDate', 'endDate', 'region'],
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
    displayYearField,
    ...dateFields,
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'outcome',
      type: 'textarea',
      required: true,
    },
    modernLocationField,
    historicalGeometryField,
    {
      name: 'relatedEvents',
      type: 'relationship',
      hasMany: true,
      relationTo: 'events',
    },
    {
      name: 'relatedPlaces',
      type: 'relationship',
      hasMany: true,
      relationTo: 'places',
    },
    {
      name: 'media',
      type: 'relationship',
      hasMany: true,
      relationTo: 'media',
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness({ requireDate: true, requireLocation: true })],
  },
  versions: versionedContent,
}
