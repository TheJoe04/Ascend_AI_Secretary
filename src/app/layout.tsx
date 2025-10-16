import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/session-provider'
import { AdminHelperWidget } from '@/components/admin/admin-helper-widget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ascend AI Secretary',
  description: 'AI-powered secretary for modern businesses',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <AdminHelperWidget />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

