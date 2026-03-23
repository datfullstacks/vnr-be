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
  periodField,
  regionField,
  sourcesField,
  summaryField,
  versionedContent,
} from '@/payload/editorial'
import { slugHook } from '@/payload/slug'

export const HistoricalOverlays: CollectionConfig = {
  slug: 'historical-overlays',
  admin: {
    defaultColumns: ['title', 'layerKind', 'validFrom', 'validTo'],
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
      name: 'layerGroup',
      type: 'select',
      defaultValue: 'historical_overlays',
      options: [{ label: 'Historical overlays', value: 'historical_overlays' }],
      required: true,
    },
    {
      name: 'layerKind',
      type: 'select',
      defaultValue: 'region',
      options: [
        { label: 'Vùng', value: 'region' },
        { label: 'Tuyến', value: 'route' },
        { label: 'Mặt trận', value: 'front' },
        { label: 'Căn cứ', value: 'base' },
        { label: 'Điểm sự kiện', value: 'point' },
      ],
      required: true,
    },
    {
      name: 'validFrom',
      type: 'date',
      required: true,
    },
    {
      name: 'validTo',
      type: 'date',
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: '#ab2f24',
      required: true,
    },
    {
      name: 'opacity',
      type: 'number',
      defaultValue: 0.35,
      required: true,
    },
    historicalGeometryField,
    {
      name: 'relatedEvent',
      type: 'relationship',
      relationTo: 'events',
    },
    {
      name: 'relatedCampaign',
      type: 'relationship',
      relationTo: 'campaigns',
    },
    sourcesField,
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness({ requireDate: true, requireLocation: true })],
  },
  versions: versionedContent,
}
