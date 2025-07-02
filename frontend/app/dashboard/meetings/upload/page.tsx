"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/ui/file-upload"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

export default function UploadMeetingPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const router = useRouter()

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select an audio file")
      return
    }

    if (!title.trim()) {
      setError("Please enter a meeting title")
      return
    }

    setIsUploading(true)
    setError("")
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      if (description) {
        formData.append("description", description)
      }

      const response = await api.post("/upload/meeting", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(progress)
          }
        },
      })

      setSuccess(true)

      console.log("Sucess fully upload file", response.data)

      // Redirect to meeting details after a short delay
      setTimeout(() => {
        router.push(`/dashboard/meetings/${response.data.meeting_id}`)
      }, 2000)
    } catch (err: any) {
      console.log("Failed to Upload meeting response", err.response)
      setError(err.response?.data?.detail || "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-center mb-2">Upload Successful!</h2>
              <p className="text-gray-600 text-center mb-6">
                Your meeting is being processed. You'll be redirected to the meeting details shortly.
              </p>
              <div className="w-full max-w-xs">
                <Progress value={100} className="mb-2" />
                <p className="text-sm text-center text-gray-500">Processing...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Meeting</h1>
          <p className="text-muted-foreground">
            Upload your meeting recording to get AI-powered transcription and insights
          </p>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>Provide information about your meeting and upload the audio file</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekly Team Standup - March 15"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the meeting topics and participants..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Audio File *</Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  accept="audio/*"
                  disabled={isUploading}
                  maxSize={100 * 1024 * 1024} // 100MB
                />
                {file && (
                  <div className="text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isUploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading || !file || !title.trim()}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Meeting
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium">Audio Processing</p>
                <p className="text-sm text-gray-600">Your audio file will be processed and transcribed using AI</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium">AI Analysis</p>
                <p className="text-sm text-gray-600">Generate summary, extract key points and action items</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium">Ready to Review</p>
                <p className="text-sm text-gray-600">Access your meeting insights and share with your team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
