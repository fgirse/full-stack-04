import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

let prismaStudioProcess: any = null

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    if (action === 'start') {
      if (prismaStudioProcess) {
        return NextResponse.json({ 
          message: 'Prisma Studio is already running',
          status: 'running',
          url: 'http://localhost:5555'
        })
      }

      prismaStudioProcess = spawn('npx', ['prisma', 'studio'], {
        detached: true,
        stdio: 'ignore'
      })

      return NextResponse.json({ 
        message: 'Prisma Studio started successfully',
        status: 'started',
        url: 'http://localhost:5555'
      })
    }

    if (action === 'stop') {
      if (prismaStudioProcess) {
        prismaStudioProcess.kill()
        prismaStudioProcess = null
        return NextResponse.json({ 
          message: 'Prisma Studio stopped',
          status: 'stopped'
        })
      }

      return NextResponse.json({ 
        message: 'Prisma Studio was not running',
        status: 'not_running'
      })
    }

    return NextResponse.json({ 
      error: 'Invalid action. Use ?action=start or ?action=stop' 
    }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to manage Prisma Studio',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}