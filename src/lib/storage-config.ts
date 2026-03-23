export function getMongoConnectionString() {
  return (
    process.env.MONGODB_URI?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.DATABASE_URI?.trim() ||
    null
  )
}

export function isDemoFallbackEnabled() {
  return process.env.ENABLE_DEMO_FALLBACK === 'true' || process.env.CONTENT_SOURCE === 'demo'
}

export function requireMongoConnectionString() {
  const connectionString = getMongoConnectionString()

  if (!connectionString) {
    throw new Error(
      'Thiếu connection string MongoDB. Hãy khai báo MONGODB_URI, DATABASE_URL hoặc DATABASE_URI.',
    )
  }

  return connectionString
}
