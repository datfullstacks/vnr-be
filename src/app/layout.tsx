import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Backend Payload CMS va public API cho VNR.',
  title: {
    default: 'VNR Backend',
    template: '%s | VNR Backend',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
