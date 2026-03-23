import type { CollectionConfig } from 'payload'

import {
  canDeleteContent,
  canManageContent,
  publishedOnlyOrAuthenticated,
} from '@/payload/access'
import {
  editorialStateField,
  ensurePublishReadiness,
  sourcesField,
  summaryField,
  versionedContent,
} from '@/payload/editorial'
import { slugHook } from '@/payload/slug'

export const HistoricalAdminUnits: CollectionConfig = {
  slug: 'historical-admin-units',
  admin: {
    defaultColumns: ['title', 'canonicalSlug', 'validFromYear', 'validToYear', 'changeType'],
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
    {
      name: 'canonicalSlug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      index: true,
      required: true,
    },
    summaryField,
    editorialStateField,
    {
      name: 'unitType',
      type: 'select',
      defaultValue: 'province',
      options: [
        { label: 'Vùng lịch sử', value: 'historical_region' },
        { label: 'Tỉnh', value: 'province' },
        { label: 'Tỉnh hợp nhất', value: 'merged_province' },
        { label: 'Thành phố trực thuộc', value: 'municipality' },
      ],
      required: true,
    },
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
      name: 'changeSlug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      required: true,
    },
    {
      name: 'changeYear',
      type: 'number',
      required: true,
    },
    {
      name: 'changeType',
      type: 'select',
      defaultValue: 'base',
      options: [
        { label: 'Ban đầu', value: 'base' },
        { label: 'Kế thừa', value: 'carried' },
        { label: 'Hợp tỉnh', value: 'merge' },
        { label: 'Tái cấu trúc', value: 'reorganized' },
        { label: 'Tách tỉnh', value: 'split' },
      ],
      required: true,
    },
    {
      name: 'displayColor',
      type: 'text',
      required: true,
    },
    {
      name: 'memberProvinceSlugs',
      type: 'array',
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
      ],
      minRows: 1,
      required: true,
    },
    {
      name: 'labelPoint',
      type: 'group',
      fields: [
        {
          name: 'longitude',
          type: 'number',
          required: true,
        },
        {
          name: 'latitude',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'predecessorCanonicalSlugs',
      type: 'array',
      fields: [
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
      ],
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness()],
  },
  versions: versionedContent,
}
