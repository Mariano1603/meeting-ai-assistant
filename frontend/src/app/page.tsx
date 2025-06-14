import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MicIcon, BrainIcon, TaskIcon, MailIcon } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Turn Your Meetings Into
              <span className="text-indigo-600"> Actionable Insights</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              AI-powered meeting transcription and summarization that automatically extracts key points, 
              action items, and sends summaries to your team.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/auth/register">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful Features for Modern Teams
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <MicIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Smart Transcription
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">High-accuracy transcription using OpenAI Whisper for any audio or video format.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <BrainIcon className="h-5 w-5 flex-none text-indigo-600" />
                  AI Summarization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Intelligent summaries that capture key decisions, discussions, and outcomes.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <TaskIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Task Extraction
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Automatically identify and extract action items with assignees and deadlines.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <MailIcon className="h-5 w-5 flex-none text-indigo-600" />
                  Team Integration
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Send summaries via email or Slack to keep everyone aligned and informed.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}

