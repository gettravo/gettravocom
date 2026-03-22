'use client'

import { useState } from 'react'
import { Sparkles, Check, Copy } from 'lucide-react'

const PROMPT = `I want to integrate the Travo API into my project to show real-time API health status.

Travo is a public API monitoring service. No authentication required.

Base URL: https://app.gettravo.com

Endpoints:

GET /api-routes/status
Returns all monitored APIs with their current status, latency, uptime, and active incidents.

Response shape:
[
  {
    "id": "...",
    "name": "Stripe",
    "slug": "stripe",
    "category": "Payments",
    "latestMetric": { "latencyMs": 142, "statusCode": 200, "success": true },
    "activeIncident": null,
    "uptime24h": 99.93
  }
]

GET /api-routes/metrics/:slug
Returns raw 24h latency metrics for a specific API (slug examples: "stripe", "openai", "github", "vercel").

GET /api-routes/incidents/:slug
Returns the last 20 incidents for a specific API.

Please help me integrate this into my project. I want to [describe your use case — e.g. "show a status banner when a key API is down", "display a latency chart for Stripe", "alert my team if OpenAI has an outage"].`

export default function CopyPromptButton() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-8 bg-white/[0.03] border border-white/8 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#FF5657]/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-[#FF5657]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-1">Build with AI</p>
          <p className="text-sm text-white/40 leading-relaxed">
            Copy a ready-made prompt and paste it into Claude, ChatGPT, or any AI assistant to instantly get integration code for your project.
          </p>
          <button
            onClick={handleCopy}
            className="mt-4 inline-flex items-center gap-2 bg-[#FF5657] hover:bg-[#FF5657]/90 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Prompt copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy AI prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
