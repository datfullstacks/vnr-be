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

export const Sources: CollectionConfig = {
  slug: 'sources',
  admin: {
    defaultColumns: ['title', 'sourceType', 'year', 'editorialState'],
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
      name: 'author',
      type: 'text',
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'publisher',
      type: 'text',
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'sourceType',
      type: 'select',
      defaultValue: 'book',
      options: [
        { label: 'Sách', value: 'book' },
        { label: 'Bài báo', value: 'article' },
        { label: 'Tư liệu lưu trữ', value: 'archive' },
        { label: 'Website', value: 'website' },
        { label: 'Triển lãm / bảo tàng', value: 'museum' },
      ],
      required: true,
    },
    {
      name: 'bibliography',
      type: 'textarea',
      required: true,
    },
    {
      name: 'license',
      type: 'text',
      required: true,
    },
    {
      name: 'reliability',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Nguồn gốc / sơ cấp', value: 'primary' },
        { label: 'Nguồn thứ cấp đã biên khảo', value: 'secondary' },
        { label: 'Tài liệu tham khảo mở rộng', value: 'reference' },
      ],
      required: true,
    },
  ],
  hooks: {
    beforeChange: [ensurePublishReadiness({ requireSources: false })],
  },
  versions: versionedContent,
}
