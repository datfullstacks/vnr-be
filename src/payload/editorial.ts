import type { CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'

import { hasRole } from '@/payload/access'

const versions = {
  drafts: {
    autosave: {
      interval: 800,
      showSaveDraftButton: true,
    },
    schedulePublish: true,
  },
  maxPerDoc: 50,
} satisfies CollectionConfig['versions']

type PublishRuleOptions = {
  requireDate?: boolean
  requireLocation?: boolean
  requireSources?: boolean
}

export const versionedContent = versions

export const editorialStateField: Field = {
  name: 'editorialState',
  type: 'select',
  admin: {
    description: 'Theo dõi quy trình duyệt nội dung nội bộ.',
    position: 'sidebar',
  },
  defaultValue: 'drafting',
  options: [
    { label: 'Đang soạn', value: 'drafting' },
    { label: 'Chờ duyệt', value: 'in-review' },
    { label: 'Cần chỉnh sửa', value: 'changes-requested' },
    { label: 'Đạt yêu cầu', value: 'approved' },
  ],
}

export const summaryField: Field = {
  name: 'summary',
  type: 'textarea',
  admin: {
    description: 'Tóm tắt ngắn hiển thị ở dòng thời gian, hộp thông tin bản đồ và trang danh sách.',
  },
  required: true,
}

export const periodField: Field = {
  name: 'period',
  type: 'relationship',
  admin: {
    position: 'sidebar',
  },
  relationTo: 'periods',
  required: true,
}

export const sourcesField: Field = {
  name: 'sources',
  type: 'relationship',
  admin: {
    description: 'Mọi bản ghi công khai cần ít nhất một nguồn đầy đủ.',
  },
  hasMany: true,
  relationTo: 'sources',
  required: true,
}

export const regionField: Field = {
  name: 'region',
  type: 'select',
  admin: {
    position: 'sidebar',
  },
  defaultValue: 'north',
  options: [
    { label: 'Miền Bắc', value: 'north' },
    { label: 'Miền Trung', value: 'central' },
    { label: 'Miền Nam', value: 'south' },
    { label: 'Liên vùng', value: 'interregional' },
    { label: 'Quốc tế', value: 'international' },
  ],
  required: true,
}

export const modernLocationField: Field = {
  name: 'modernLocation',
  type: 'group',
  fields: [
    {
      name: 'label',
      type: 'text',
    },
    {
      name: 'province',
      type: 'text',
    },
    {
      name: 'longitude',
      type: 'number',
      admin: {
        step: 0.000001,
      },
    },
    {
      name: 'latitude',
      type: 'number',
      admin: {
        step: 0.000001,
      },
    },
  ],
}

export const historicalGeometryField: Field = {
  name: 'historicalGeometry',
  type: 'json',
  admin: {
    description: 'GeoJSON cho vùng, tuyến hoặc điểm lịch sử.',
  },
}

export const displayYearField: Field = {
  name: 'displayYear',
  type: 'number',
  admin: {
    description: 'Năm cố định để bản ghi xuất hiện trên dòng thời gian và lớp ranh giới.',
    position: 'sidebar',
  },
  required: true,
}

export const dateFields: Field[] = [
  {
    name: 'startDate',
    type: 'date',
    required: true,
  },
  {
    name: 'endDate',
    type: 'date',
  },
  {
    name: 'datePrecision',
    type: 'select',
    defaultValue: 'day',
    options: [
      { label: 'Ngày chính xác', value: 'day' },
      { label: 'Tháng', value: 'month' },
      { label: 'Năm', value: 'year' },
      { label: 'Khoảng thời gian', value: 'range' },
      { label: 'Ước lượng', value: 'approximate' },
    ],
    required: true,
  },
]

export function ensurePublishReadiness(options: PublishRuleOptions = {}): CollectionBeforeChangeHook {
  return async ({ data, originalDoc, req }) => {
    const { requireSources = true } = options
    const nextStatus = data?._status ?? originalDoc?._status

    if (nextStatus !== 'published') {
      return data
    }

    if (!hasRole(req.user, ['admin']) && req.context?.seed !== true) {
      throw new Error('Chỉ quản trị viên mới được xuất bản nội dung.')
    }

    if (!data?.title || !data?.summary) {
      throw new Error('Bản ghi công khai phải có tiêu đề và tóm tắt.')
    }

    if (requireSources && (!Array.isArray(data?.sources) || data.sources.length === 0)) {
      throw new Error('Bản ghi công khai phải có ít nhất một nguồn.')
    }

    const hasStartDate = Boolean(data?.startDate ?? data?.validFrom)

    if (options.requireDate && !hasStartDate) {
      throw new Error('Bản ghi công khai phải có mốc thời gian bắt đầu.')
    }

    if (options.requireLocation) {
      const hasModernLocation =
        Boolean(data?.modernLocation?.label) ||
        (typeof data?.modernLocation?.longitude === 'number' &&
          typeof data?.modernLocation?.latitude === 'number')
      const hasHistoricalGeometry = Boolean(data?.historicalGeometry)
      const hasPlaces = Array.isArray(data?.places) && data.places.length > 0
      const hasRelatedPlaces =
        Array.isArray(data?.relatedPlaces) && data.relatedPlaces.length > 0

      if (!hasModernLocation && !hasHistoricalGeometry && !hasPlaces && !hasRelatedPlaces) {
        throw new Error(
          'Bản ghi công khai phải có modernLocation, historicalGeometry hoặc ít nhất một địa danh liên quan.',
        )
      }
    }

    return data
  }
}
