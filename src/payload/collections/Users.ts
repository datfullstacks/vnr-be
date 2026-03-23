import type { CollectionConfig } from 'payload'

import { isAdminOnly } from '@/payload/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  access: {
    admin: isAdminOnly,
    create: isAdminOnly,
    delete: isAdminOnly,
    read: isAdminOnly,
    update: isAdminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Quản trị viên', value: 'admin' },
        { label: 'Biên tập viên', value: 'editor' },
        { label: 'Phản biện', value: 'reviewer' },
      ],
      required: true,
    },
  ],
}
