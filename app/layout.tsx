import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'This-Is-For',
  description: 'This-Is-For - Your AI chat companion powered by AI Builder API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}
