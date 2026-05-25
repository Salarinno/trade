import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TradeLog — ژورنال ترید حرفه‌ای',
  description: 'ثبت، تحلیل و بهبود معاملاتت با TradeLog',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  )
}
