import type { FieldHook } from 'payload'

export function formatSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const slugHook: FieldHook = ({ data, operation, value }) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return formatSlug(value)
  }

  if (operation === 'create' || operation === 'update') {
    const fallback = typeof data?.title === 'string' ? data.title : undefined

    if (fallback) {
      return formatSlug(fallback)
    }
  }

  return value
}
