import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const [
      adminCount,
      studentCount,
      teacherCount,
      parentCount,
      classCount,
      subjectCount,
      lessonCount,
      examCount,
      assignmentCount,
      eventCount,
      announcementCount,
    ] = await Promise.all([
      prisma.admin.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.class.count(),
      prisma.subject.count(),
      prisma.lesson.count(),
      prisma.exam.count(),
      prisma.assignment.count(),
      prisma.event.count(),
      prisma.announcement.count(),
    ])

    // Get recent activities
    const recentStudents = await prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { name: true, surname: true, createdAt: true },
    })

    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { startTime: "desc" },
      select: { title: true, startTime: true, class: { select: { name: true } } },
    })

    const stats = {
      totals: {
        admins: adminCount,
        students: studentCount,
        teachers: teacherCount,
        parents: parentCount,
        classes: classCount,
        subjects: subjectCount,
        lessons: lessonCount,
        exams: examCount,
        assignments: assignmentCount,
        events: eventCount,
        announcements: announcementCount,
      },
      recent: {
        students: recentStudents,
        events: recentEvents,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching database stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch database statistics",
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
