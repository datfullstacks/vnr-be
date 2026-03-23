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

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    defaultColumns: ['title', 'startDate', 'region', 'updatedAt'],
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
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'topics',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Tổ chức lực lượng', value: 'organization' },
        { label: 'Khởi nghĩa', value: 'uprising' },
        { label: 'Ngoại giao', value: 'diplomacy' },
        { label: 'Quân sự', value: 'military' },
        { label: 'Văn hóa - tuyên truyền', value: 'culture' },
      ],
    },
    modernLocationField,
    historicalGeometryField,
    {
      name: 'places',
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
