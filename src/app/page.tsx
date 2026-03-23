import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', margin: '4rem auto', maxWidth: '48rem', padding: '0 1rem' }}>
      <h1>VNR Backend</h1>
      <p>Payload CMS, admin va public API cho frontend VNR.</p>
      <ul>
        <li>
          Admin: <Link href="/admin">/admin</Link>
        </li>
        <li>
          REST API Payload: <Link href="/api">/api</Link>
        </li>
        <li>
          Public explorer API: <Link href="/api/public/explorer">/api/public/explorer</Link>
        </li>
      </ul>
    </main>
  )
}
