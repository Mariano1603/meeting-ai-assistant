"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckSquare, TrendingUp, Calendar, Users, Mic } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { meetingApi, taskApi } from "@/lib/api"

interface DashboardStats {
  total_meetings: number
  total_tasks: number
  pending_tasks: number
  completed_tasks: number
  recent_meetings: Array<{
    id: string
    title: string
    created_at: string
    status: string
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch data from available endpoints
        const [meetingsResponse, tasksResponse] = await Promise.all([
          meetingApi.getMeetings(),
          taskApi.getTasks()
        ])

        const meetings = meetingsResponse.meetings || []
        const tasks = tasksResponse || []
        
        // Calculate stats from actual data
        const pendingTasks = tasks.filter((task: any) => task.status !== 'completed').length
        const completedTasks = tasks.filter((task: any) => task.status === 'completed').length
        
        // Get recent meetings (last 5)
        const recentMeetings = meetings.slice(0, 5).map((meeting: any) => ({
          id: meeting.id,
          title: meeting.title || meeting.filename || `Meeting ${meeting.id}`,
          created_at: meeting.created_at,
          status: meeting.status || 'completed'
        }))

        setStats({
          total_meetings: meetings.length,
          total_tasks: tasks.length,
          pending_tasks: pendingTasks,
          completed_tasks: completedTasks,
          recent_meetings: recentMeetings
        })
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        // Set fallback data if API calls fail
        setStats({
          total_meetings: 0,
          total_tasks: 0,
          pending_tasks: 0,
          completed_tasks: 0,
          recent_meetings: []
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const taskCompletionRate = stats ? (stats.completed_tasks / (stats.total_tasks || 1)) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your meetings.</p>
          </div>
          <Link href="/dashboard/meetings/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Meeting
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_meetings || 0}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pending_tasks || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.total_tasks || 0} total tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(taskCompletionRate)}%</div>
              <Progress value={taskCompletionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">meetings scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Meetings</CardTitle>
              <CardDescription>Your latest meeting recordings and summaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.recent_meetings?.length ? (
                stats.recent_meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mic className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{meeting.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(meeting.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={meeting.status === "completed" ? "default" : "secondary"}>{meeting.status}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Mic className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload your first meeting recording to get started.</p>
                  <div className="mt-6">
                    <Link href="/dashboard/meetings/upload">
                      <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Meeting
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/meetings/upload">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Meeting
                </Button>
              </Link>
              <Link href="/dashboard/meetings">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Meetings
                </Button>
              </Link>
              <Link href="/dashboard/tasks">
                <Button variant="outline" className="w-full justify-start">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Manage Tasks
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Team Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
