import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export interface SessionUser {
  id: string
  email: string
  role: string
  organizationId: string
}

/**
 * Get the current session on the server side
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Get the current user from session or throw error
 */
export async function getCurrentUser(): Promise<SessionUser> {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return session.user as SessionUser
}

/**
 * Get the organizationId from session or throw error
 */
export async function getOrganizationId(): Promise<string> {
  const user = await getCurrentUser()
  return user.organizationId
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  return user
}

/**
 * Check if user has specific role
 */
export async function requireRole(requiredRole: string): Promise<SessionUser> {
  const user = await requireAuth()
  
  if (user.role !== requiredRole) {
    throw new Error(`Access denied. Required role: ${requiredRole}`)
  }

  return user
}

/**
 * Check if user has admin role
 */
export async function requireAdmin(): Promise<SessionUser> {
  return await requireRole("admin")
}
