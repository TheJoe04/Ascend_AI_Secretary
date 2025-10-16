export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import NextAuth, { type NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// Extend the default session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      organizationId: string
    }
  }

  interface User {
    id: string
    email: string
    role: string
    organizationId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    organizationId: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              organizationId: true,
            }
          })

          if (!user) return null

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) return null

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            name: user.email,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.organizationId = (user as any).organizationId
      }
      return token
    },
    async session({ session, token }) {
      if (!session.user) {
        // ensure user exists on session
        (session as any).user = { id: "", email: "", role: "", organizationId: "" }
      }
      (session.user as any).id = token.id as string
      ;(session.user as any).role = token.role as string
      ;(session.user as any).organizationId = token.organizationId as string
      return session
    }
  },
  pages: { signIn: "/login" },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers } = NextAuth(authOptions)
export const GET = handlers.GET
export const POST = handlers.POST
