import type { Access, Where } from 'payload'

export type UserRole = 'admin' | 'editor' | 'reviewer'

export function hasRole(user: unknown, roles: UserRole[]) {
  if (!user || typeof user !== 'object' || !('role' in user)) {
    return false
  }

  return roles.includes(user.role as UserRole)
}

export const isAdmin: Access = ({ req }) => hasRole(req.user, ['admin'])

export const isAdminOnly = ({ req }: { req: { user?: unknown } }) => hasRole(req.user, ['admin'])

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const canManageContent: Access = ({ req }) =>
  hasRole(req.user, ['admin', 'editor', 'reviewer'])

export const canDeleteContent: Access = ({ req }) => hasRole(req.user, ['admin'])

export const publishedOnlyOrAuthenticated: Access = ({ req }) => {
  if (req.user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  } satisfies Where
}
