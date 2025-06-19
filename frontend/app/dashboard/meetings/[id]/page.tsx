"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, Edit, Calendar, Clock, FileText, CheckSquare, Volume2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AudioPlayer } from "@/components/meeting/audio-player"
import { TaskList } from "@/components/meeting/task-list"
import { MeetingSummary } from "@/components/ui/meeting-summary"
import { api } from "@/lib/api"

interface Meeting {
  id: string
  title: string
  description?: string
  audio_file_path?: string
  transcript?: string
  summary?: string
  status: "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
  duration?: number
  tasks: Array<{
    id: string
    title: string
    description?: string
    assignee?: string
    due_date?: string
    status: "pending" | "in_progress" | "completed"
    priority: "low" | "medium" | "high"
  }>
}

export default function MeetingDetailsPage() {
  const params = useParams()
  const meetingId = params.id as string

  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await api.get(`/meetings/${meetingId}`)
        console.log("SUCESS FETCH TO MEETING", response.data)
        setMeeting(response.data)
      } catch (err: any) {
        console.log("FAILED TO FETCH MEETING", err.response)
        setError(err.response?.data?.detail || "Failed to load meeting")
      } finally {
        setIsLoading(false)
      }
    }

    if (meetingId) {
      fetchMeeting()
    }
  }, [meetingId])

  const handleTaskUpdate = (taskId: string, updates: any) => {
    if (!meeting) return

    setMeeting({
      ...meeting,
      tasks: meeting.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !meeting) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{error || "Meeting not found"}</h3>
            <p className="text-gray-500 text-center">
              The meeting you're looking for doesn't exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
              <Badge variant={getStatusColor(meeting.status)}>{meeting.status}</Badge>
            </div>
            {meeting.description && <p className="text-muted-foreground">{meeting.description}</p>}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(meeting.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(meeting.duration)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckSquare className="h-4 w-4" />
                <span>{meeting?.tasks?.length} tasks</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                {meeting.summary ? (
                  <MeetingSummary summary={meeting.summary} />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Summary not available</h3>
                      <p className="text-gray-500 text-center">
                        {meeting.status === "processing"
                          ? "AI is still processing this meeting. Check back in a few minutes."
                          : "Summary could not be generated for this meeting."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="transcript" className="space-y-4">
                {meeting.transcript ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Meeting Transcript</CardTitle>
                      <CardDescription>AI-generated transcript of the meeting audio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{meeting.transcript}</div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Transcript not available</h3>
                      <p className="text-gray-500 text-center">
                        {meeting.status === "processing"
                          ? "AI is still transcribing this meeting. Check back in a few minutes."
                          : "Transcript could not be generated for this meeting."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* <TabsContent value="tasks" className="space-y-4">
                <TaskList tasks={meeting.tasks} onTaskUpdate={handleTaskUpdate} />
              </TabsContent> */}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audio Player */}
            {meeting.audio_file_path && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Volume2 className="h-5 w-5" />
                    <span>Audio Recording</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AudioPlayer audioUrl={meeting.audio_file_path} />
                </CardContent>
              </Card>
            )}

            {/* Meeting Info */}
            <Card>
              <CardHeader>
                <CardTitle>Meeting Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p className="mt-1 text-sm">{new Date(meeting.created_at).toLocaleString()}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <p className="mt-1 text-sm">{new Date(meeting.updated_at).toLocaleString()}</p>
                </div>

                {meeting.duration && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duration</Label>
                    <p className="mt-1 text-sm">{formatDuration(meeting.duration)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total Tasks</span>
                  <span className="font-medium">
                    {meeting?.tasks?.length}

                    </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Completed</span>
                  <span className="font-medium">
                    
                   {/* {meeting.tasks.filter((t) => t.status === "completed").length}*/}

                    </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">In Progress</span>
                  <span className="font-medium">
                    
                   {/*  {meeting.tasks.filter((t) => t.status === "in_progress").length} */}

                    </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pending</span>
                  <span className="font-medium">
                    {/* {meeting.tasks.filter((t) => t.status === "pending").length} */}
                    abhi to pending bhi 0 hai
                    </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
