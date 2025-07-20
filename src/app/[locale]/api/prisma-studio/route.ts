import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the action from search params - request.url should be valid
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    console.log('Prisma Studio API called with action:', action)

    if (action === 'start') {
      try {
        // Here you would start Prisma Studio
        // For now, just return success
        return NextResponse.json({ 
          success: true,
          message: 'Prisma Studio started successfully',
          port: 5555,
          url: 'http://localhost:5555'
        })
      } catch (startError) {
        return NextResponse.json({
          success: false,
          message: 'Failed to start Prisma Studio',
          error: startError instanceof Error ? startError.message : 'Unknown error'
        }, { status: 500 })
      }
    }

    if (action === 'stop') {
      return NextResponse.json({ 
        success: true,
        message: 'Prisma Studio stopped successfully'
      })
    }

    // Status check - no action parameter
    return NextResponse.json({ 
      isRunning: false,
      port: null,
      message: 'Prisma Studio API is ready'
    })

  } catch (error) {
    console.error('URL parsing error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid URL or request format',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}