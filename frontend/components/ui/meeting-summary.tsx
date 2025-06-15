"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Users, Clock, CheckSquare, AlertCircle, TrendingUp } from "lucide-react"

interface MeetingSummaryProps {
  summary: string
  className?: string
}

export function MeetingSummary({ summary, className }: MeetingSummaryProps) {
  // Parse the summary to extract structured information
  // This is a simple implementation - in a real app, you'd have structured data from the backend
  const parseSummary = (text: string) => {
    const sections = text.split("\n\n")
    const parsed = {
      overview: "",
      keyPoints: [] as string[],
      decisions: [] as string[],
      actionItems: [] as string[],
      participants: [] as string[],
    }

    sections.forEach((section) => {
      const lines = section.split("\n")
      const header = lines[0]?.toLowerCase()

      if (header.includes("overview") || header.includes("summary")) {
        parsed.overview = lines.slice(1).join(" ").trim()
      } else if (header.includes("key points") || header.includes("highlights")) {
        parsed.keyPoints = lines
          .slice(1)
          .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
          .map((line) => line.replace(/^[-•]\s*/, ""))
      } else if (header.includes("decisions")) {
        parsed.decisions = lines
          .slice(1)
          .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
          .map((line) => line.replace(/^[-•]\s*/, ""))
      } else if (header.includes("action") || header.includes("tasks")) {
        parsed.actionItems = lines
          .slice(1)
          .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
          .map((line) => line.replace(/^[-•]\s*/, ""))
      } else if (header.includes("participants") || header.includes("attendees")) {
        parsed.participants = lines
          .slice(1)
          .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
          .map((line) => line.replace(/^[-•]\s*/, ""))
      }
    })

    return parsed
  }

  const parsedSummary = parseSummary(summary)

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Meeting Summary</span>
          </CardTitle>
          <CardDescription>AI-generated summary with key insights and action items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview */}
          {parsedSummary.overview && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Overview</span>
              </h3>
              <p className="text-gray-700 leading-relaxed">{parsedSummary.overview}</p>
            </div>
          )}

          {/* Key Points */}
          {parsedSummary.keyPoints.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Key Points</span>
                </h3>
                <ul className="space-y-2">
                  {parsedSummary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Decisions */}
          {parsedSummary.decisions.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>Decisions Made</span>
                </h3>
                <ul className="space-y-2">
                  {parsedSummary.decisions.map((decision, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Action Items */}
          {parsedSummary.actionItems.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Action Items</span>
                </h3>
                <ul className="space-y-2">
                  {parsedSummary.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Participants */}
          {parsedSummary.participants.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Participants</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedSummary.participants.map((participant, index) => (
                    <Badge key={index} variant="secondary">
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Fallback for unstructured summary */}
          {!parsedSummary.overview && parsedSummary.keyPoints.length === 0 && (
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{summary}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
