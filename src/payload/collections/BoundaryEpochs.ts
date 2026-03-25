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

export const BoundaryEpochs: CollectionConfig = {
  slug: 'boundary-epochs',
  admin: {
    defaultColumns: ['title', 'validFromYear', 'validToYear'],
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
      name: 'validFromYear',
      type: 'number',
      required: true,
    },
    {
      name: 'validToYear',
      type: 'number',
      required: true,
    },
    {
      name: 'units',
      type: 'relationship',
      hasMany: true,
      relationTo: 'historical-admin-units',
      required: true,
    },
    {
      name: 'boundaryFeatures',
      type: 'json',
      required: true,
    },
    {
      name: 'labelFeatures',
      type: 'json',
      required: true,
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness()],
  },
  versions: versionedContent,
}
