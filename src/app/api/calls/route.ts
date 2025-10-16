import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationId } from '@/lib/auth'
import { db } from '@/lib/db'
import { Call } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Get organizationId from authenticated session
    const organizationId = await getOrganizationId()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const sentiment = searchParams.get('sentiment') || undefined

    // Validate pagination parameters
    const validPage = Math.max(1, page)
    const validLimit = Math.min(100, Math.max(1, limit)) // Cap at 100 items per page
    const skip = (validPage - 1) * validLimit

    // Build where clause for multi-tenant filtering
    const whereClause: any = {
      organizationId: organizationId
    }

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { callerName: { contains: search, mode: 'insensitive' } },
        { callerNumber: { contains: search, mode: 'insensitive' } },
        { transcript: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add status filter if provided
    if (status) {
      const statusArray = status.split(',').map(s => s.trim())
      whereClause.status = { in: statusArray }
    }

    // Add sentiment filter if provided
    if (sentiment) {
      const sentimentArray = sentiment.split(',').map(s => s.trim())
      whereClause.sentiment = { in: sentimentArray }
    }

    // Execute queries in parallel
    const [calls, total] = await Promise.all([
      // Get paginated calls
      db.call.findMany({
        where: whereClause,
        orderBy: { timestamp: 'desc' },
        skip: skip,
        take: validLimit,
        select: {
          id: true,
          organizationId: true,
          twilioCallSid: true,
          callerName: true,
          callerNumber: true,
          duration: true,
          status: true,
          sentiment: true,
          timestamp: true,
          transcript: true,
          recordingUrl: true,
          tags: true,
          notes: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      // Get total count for pagination
      db.call.count({
        where: whereClause
      })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / validLimit)
    const hasNextPage = validPage < totalPages
    const hasPrevPage = validPage > 1

    // Return response
    return NextResponse.json({
      data: calls,
      total: total,
      page: validPage,
      limit: validLimit,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage
    })

  } catch (error) {
    console.error('Calls API error:', error)

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
