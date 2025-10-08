import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { AdminHelperWidget } from '@/components/admin/admin-helper-widget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ascend AI Secretary',
  description: 'AI-powered secretary for modern businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AdminHelperWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}

