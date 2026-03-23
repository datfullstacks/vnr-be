export function indexBySlug<T extends { id?: number | string; slug: string }>(items: T[]) {
  return items.reduce<Record<string, number | string>>((acc, item) => {
    if (item.id !== undefined) {
      acc[item.slug] = item.id
    }

    return acc
  }, {})
}
