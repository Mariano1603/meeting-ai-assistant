"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, CheckSquare, Play, MoreHorizontal, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Meeting {
  id: string
  title: string
  description?: string
  status: "processing" | "completed" | "failed"
  created_at: string
  duration?: number
  tasks_count?: number
}

interface MeetingCardProps {
  meeting: Meeting
}

export function MeetingCard({ meeting }: MeetingCardProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-3 w-3" />
      case "processing":
        return <Clock className="h-3 w-3 animate-spin" />
      case "failed":
        return <FileText className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">
              <Link href={`/dashboard/meetings/${meeting.id}`} className="hover:text-blue-600 transition-colors">
                {meeting.title}
              </Link>
            </CardTitle>
            {meeting.description && <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/meetings/${meeting.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                Play Audio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(meeting.created_at).toLocaleDateString()}</span>
            </div>
            {meeting.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(meeting.duration)}</span>
              </div>
            )}
            {meeting.tasks_count !== undefined && (
              <div className="flex items-center space-x-1">
                <CheckSquare className="h-3 w-3" />
                <span>{meeting.tasks_count} tasks</span>
              </div>
            )}
          </div>
          <Badge variant={getStatusColor(meeting.status)} className="flex items-center space-x-1">
            {getStatusIcon(meeting.status)}
            <span>{meeting.status}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
