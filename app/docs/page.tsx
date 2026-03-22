import Link from 'next/link'
import { ArrowLeft, Terminal, Zap, Bell, Layers, Github, Globe, Key, Download, ChevronRight } from 'lucide-react'
import { fetchAllStatus } from '@/lib/travo-api'
import CopyPromptButton from '@/components/docs/CopyPromptButton'

export const revalidate = 60

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'my-stack', label: 'My Stack' },
  { id: 'stack-detection', label: 'Auto Stack Detection' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'alerts', label: 'Alerts & Notifications' },
  { id: 'integrations-hooktap', label: 'HookTap Integration' },
  { id: 'integrations-webhook', label: 'Webhook Integration' },
  { id: 'api', label: 'Status API' },
  { id: 'faq', label: 'FAQ' },
]

export default async function DocsPage() {
  const allApis = await fetchAllStatus()
  const apiCount = allApis.length > 0 ? allApis.length : 60
  const categoryCount = allApis.length > 0 ? [...new Set(allApis.map((a) => a.category))].length : 10
  const categories = allApis.length > 0
    ? [...new Set(allApis.map((a) => a.category))].join(', ')
    : 'AI, Payments, Cloud, Database, Auth, Communication, Search, Monitoring, Analytics, Media, Maps, Productivity, Commerce'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <Link href="/">
              <img src="/whitelogo.png" alt="Travo" className="h-5 w-auto" />
            </Link>
            <span className="text-xs text-white/30 font-medium uppercase tracking-widest">Docs</span>
          </div>
          <Link
            href="https://app.gettravo.com"
            className="rounded-full bg-[#FF5657] px-4 py-2 text-xs font-semibold text-white hover:bg-[#FF5657]/90 transition-all"
          >
            Open App
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-16 flex gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-28">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">On this page</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors py-1.5 group"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#FF5657] transition-opacity" />
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 max-w-3xl space-y-20">

          {/* Introduction */}
          <section id="introduction">
            <Pill>Introduction</Pill>
            <h1 className="text-4xl font-bold text-white mt-4 mb-6">Travo Documentation</h1>
            <p className="text-white/60 text-lg leading-relaxed mb-4">
              Travo is an independent API health monitoring platform for developers. It continuously monitors popular developer APIs — measuring latency, error rates, and uptime — and notifies you when something breaks.
            </p>
            <p className="text-white/60 leading-relaxed">
              Unlike vendor status pages, Travo runs its own synthetic checks from the outside, giving you an objective view of whether an API is actually reachable and performing well from your users&apos; perspective.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Globe className="w-5 h-5" />, label: `${apiCount}+ APIs monitored`, desc: `Across ${categoryCount} categories including AI, payments, cloud, and more` },
                { icon: <Zap className="w-5 h-5" />, label: 'Checked every minute', desc: 'Staggered synthetic checks around the clock' },
                { icon: <Bell className="w-5 h-5" />, label: 'Instant alerts', desc: 'Email, webhook, and HookTap push notifications' },
              ].map((item) => (
                <div key={item.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
                  <div className="text-[#FF5657] mb-3">{item.icon}</div>
                  <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Getting Started */}
          <section id="getting-started">
            <Pill>Getting Started</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Getting Started</h2>
            <p className="text-white/60 mb-8">You don&apos;t need to install anything. Travo runs entirely in the browser.</p>

            <Steps>
              <Step n={1} title="Create a free account">
                Go to <InlineLink href="https://app.gettravo.com">app.gettravo.com</InlineLink> and sign up with your email. No credit card required for the free tier.
              </Step>
              <Step n={2} title="View the API Status dashboard">
                After logging in, you&apos;ll see the <strong className="text-white">Services</strong> page — a live overview of all {apiCount}+ monitored APIs with their current status, latency, and uptime.
              </Step>
              <Step n={3} title="Set up your Stack">
                Go to <strong className="text-white">My Stack</strong> and select the APIs your project depends on. You can either pick them manually or auto-detect them from a GitHub repository.
              </Step>
              <Step n={4} title="Configure alerts (optional)">
                Navigate to <strong className="text-white">Alerts</strong> to enable email, webhook, or HookTap notifications when your stack has an incident.
              </Step>
            </Steps>
          </section>

          <Divider />

          {/* Dashboard */}
          <section id="dashboard">
            <Pill>Dashboard</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Dashboard</h2>
            <p className="text-white/60 mb-6">
              The main dashboard gives you a summary of the current state across all monitored APIs.
            </p>
            <DocList>
              <DocItem title="Total / Operational / Degraded / Down">
                Four stat cards at the top show you at a glance how many APIs are currently healthy or experiencing issues.
              </DocItem>
              <DocItem title="Status Banner">
                A green or yellow banner summarises whether all monitored services are operational or if there are active incidents.
              </DocItem>
              <DocItem title="Recent Incidents">
                A feed of the latest detected incidents across all APIs, with links to the individual service detail pages.
              </DocItem>
              <DocItem title="My Stack">
                A live preview of the APIs in your personal stack, showing current latency and status for each.
              </DocItem>
            </DocList>
          </section>

          <Divider />

          {/* Services */}
          <section id="services">
            <Pill>Services</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Services Page</h2>
            <p className="text-white/60 mb-6">
              The <strong className="text-white">Services</strong> page shows all {apiCount}+ monitored APIs with real-time status, latency, and 24h uptime.
            </p>
            <DocList>
              <DocItem title="Search">
                Filter APIs by name using the search box.
              </DocItem>
              <DocItem title="Status filter">
                Show only Operational, Degraded, or Down APIs.
              </DocItem>
              <DocItem title="Category filter">
                Filter by category: AI, Payments, Cloud, DevTools, Database, Auth, Communication, Productivity, or Commerce.
              </DocItem>
              <DocItem title="Auto-refresh">
                Data is polled every 30 seconds so status changes appear without a page reload.
              </DocItem>
            </DocList>

            <h3 className="text-lg font-semibold text-white mt-8 mb-4">Service detail page</h3>
            <p className="text-white/60 mb-4">
              Clicking any API card opens a detail page showing:
            </p>
            <DocList>
              <DocItem title="Uptime summary">24h and 7-day uptime percentages.</DocItem>
              <DocItem title="90-day uptime bar">A daily uptime visualization for the last 90 days.</DocItem>
              <DocItem title="Latency chart">Average latency over the last 24 hours in 5-minute buckets.</DocItem>
              <DocItem title="Error rate chart">Error rate percentage over the last 24 hours.</DocItem>
              <DocItem title="Incident history">All detected incidents for this API with severity, type, and duration.</DocItem>
            </DocList>
          </section>

          <Divider />

          {/* My Stack */}
          <section id="my-stack">
            <Pill>My Stack</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">My Stack</h2>
            <p className="text-white/60 mb-6">
              My Stack lets you create a personal monitoring view of only the APIs your project depends on. This makes it easy to quickly diagnose whether a problem is in your own code or caused by an external service.
            </p>
            <DocList>
              <DocItem title="Manual selection">
                Browse all available APIs and check the ones you use.
              </DocItem>
              <DocItem title="Auto-detection">
                Paste a GitHub repository URL and Travo automatically detects which APIs are used — see the <a href="#stack-detection" className="text-[#FF5657] hover:underline">Auto Stack Detection</a> section.
              </DocItem>
              <DocItem title="Stack status banner">
                At the top of My Stack you&apos;ll see a banner showing whether all your stack services are healthy or if any are experiencing issues.
              </DocItem>
            </DocList>
          </section>

          <Divider />

          {/* Stack Detection */}
          <section id="stack-detection">
            <Pill>Auto Stack Detection</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Automatic Stack Detection</h2>
            <p className="text-white/60 mb-6">
              Travo can analyze your GitHub repository and automatically identify which monitored APIs your project depends on.
            </p>
            <h3 className="text-base font-semibold text-white mb-3">How to use it</h3>
            <Steps>
              <Step n={1} title="Go to My Stack → Edit Stack">
                Click the <strong className="text-white">Edit Stack</strong> button on your stack page.
              </Step>
              <Step n={2} title="Enter your GitHub repository URL">
                Paste a public GitHub repository URL, e.g. <code className="text-[#FF5657] text-xs">https://github.com/yourname/yourrepo</code>
              </Step>
              <Step n={3} title="Detect dependencies">
                Click <strong className="text-white">Detect from GitHub</strong>. Travo analyzes your dependency files and pre-selects matching APIs.
              </Step>
            </Steps>

            <h3 className="text-base font-semibold text-white mt-8 mb-3">Supported dependency files</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { file: 'package.json', lang: 'Node.js / npm' },
                { file: 'requirements.txt', lang: 'Python (pip)' },
                { file: 'Pipfile', lang: 'Python (Pipenv)' },
                { file: 'go.mod', lang: 'Go modules' },
                { file: 'Gemfile', lang: 'Ruby' },
                { file: 'composer.json', lang: 'PHP' },
              ].map((item) => (
                <div key={item.file} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                  <code className="text-xs text-[#FF5657] font-mono">{item.file}</code>
                  <p className="text-xs text-white/40 mt-1">{item.lang}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Incidents */}
          <section id="incidents">
            <Pill>Incidents</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Incidents</h2>
            <p className="text-white/60 mb-6">
              Travo automatically detects incidents based on the data collected during synthetic checks. No manual reporting is needed.
            </p>
            <h3 className="text-base font-semibold text-white mb-4">Incident types</h3>
            <DocList>
              <DocItem title="Downtime — Critical">
                Triggered when the last 3 consecutive checks all failed. Resolved automatically when checks start succeeding again.
              </DocItem>
              <DocItem title="High Error Rate — Warning / Critical">
                Triggered when the failure rate over the last 10 checks exceeds 20%. Severity is Critical above 50%.
              </DocItem>
              <DocItem title="Latency Spike — Warning">
                Triggered when the average latency of the last 5 successful checks exceeds the API-specific threshold.
              </DocItem>
            </DocList>

            <h3 className="text-base font-semibold text-white mt-8 mb-4">Incident lifecycle</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Incidents are opened automatically when conditions are detected and closed automatically when the situation normalises. You can view active and historical incidents on the <strong className="text-white">Incidents</strong> page or in the detail page of each individual API.
            </p>
          </section>

          <Divider />

          {/* Alerts */}
          <section id="alerts">
            <Pill>Alerts</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Alerts & Notifications</h2>
            <p className="text-white/60 mb-6">
              Configure notification channels in the <strong className="text-white">Alerts</strong> page. Alerts are sent when a new incident is detected for any API.
            </p>
            <DocList>
              <DocItem title="Alert triggers">
                Notifications are sent for three event types: API Downtime, High Error Rate, and Latency Spikes — matching the incident detection logic above.
              </DocItem>
              <DocItem title="Email">
                Enter your email address and enable email notifications. Emails are sent from <code className="text-xs text-[#FF5657]">notifications@mail.gettravo.com</code>.
              </DocItem>
              <DocItem title="Webhook">
                Provide an HTTP endpoint URL. Travo will POST a JSON payload when an incident is detected. See the <a href="#integrations-webhook" className="text-[#FF5657] hover:underline">Webhook Integration</a> section.
              </DocItem>
              <DocItem title="HookTap">
                Enter your HookTap Hook ID to receive instant iPhone push notifications. See the <a href="#integrations-hooktap" className="text-[#FF5657] hover:underline">HookTap Integration</a> section.
              </DocItem>
            </DocList>
          </section>

          <Divider />

          {/* HookTap */}
          <section id="integrations-hooktap">
            <Pill>Integration</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">HookTap Integration</h2>
            <p className="text-white/60 mb-6">
              <InlineLink href="https://hooktap.me">HookTap</InlineLink> is an iOS app that receives webhooks and turns them into instant iPhone push notifications, lock screen widgets, and Live Activities — with no account required.
            </p>
            <Steps>
              <Step n={1} title="Install HookTap">
                Download HookTap from the App Store on your iPhone.
              </Step>
              <Step n={2} title="Get your Hook ID">
                Open the app and copy your personal Hook ID from the settings screen.
              </Step>
              <Step n={3} title="Add it to Travo">
                Go to <strong className="text-white">Alerts</strong> in Travo, enable HookTap, and paste your Hook ID.
              </Step>
            </Steps>

            <h3 className="text-base font-semibold text-white mt-8 mb-3">Payload sent to HookTap</h3>
            <CodeBlock>{`POST https://hooks.hooktap.me/webhook/<YOUR_HOOK_ID>

{
  "type": "push",
  "title": "🔴 Stripe",
  "body": "Stripe is down: last 3 consecutive checks failed."
}`}</CodeBlock>
          </section>

          <Divider />

          {/* Webhook */}
          <section id="integrations-webhook">
            <Pill>Integration</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Webhook Integration</h2>
            <p className="text-white/60 mb-6">
              Travo can POST to any HTTP endpoint when an incident is detected. Use this to connect to n8n, Zapier, Make, Slack, PagerDuty, or your own backend.
            </p>
            <h3 className="text-base font-semibold text-white mb-3">Payload format</h3>
            <CodeBlock>{`POST <your-webhook-url>
Content-Type: application/json

{
  "type": "incident",
  "api": "openai",
  "severity": "critical",
  "incidentType": "downtime",
  "message": "OpenAI is down: last 3 consecutive checks failed.",
  "startedAt": "2024-06-01T14:32:00.000Z"
}`}</CodeBlock>
            <h3 className="text-base font-semibold text-white mt-8 mb-3">Field reference</h3>
            <div className="overflow-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Field</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['type', 'string', 'Always "incident"'],
                    ['api', 'string', 'API slug, e.g. "stripe", "openai"'],
                    ['severity', 'string', '"critical" or "warning"'],
                    ['incidentType', 'string', '"downtime", "error_rate", or "latency"'],
                    ['message', 'string', 'Human-readable description of the incident'],
                    ['startedAt', 'string', 'ISO 8601 timestamp when the incident was detected'],
                  ].map(([field, type, desc]) => (
                    <tr key={field}>
                      <td className="px-4 py-3"><code className="text-xs text-[#FF5657] font-mono">{field}</code></td>
                      <td className="px-4 py-3 text-xs text-white/40">{type}</td>
                      <td className="px-4 py-3 text-xs text-white/50">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Divider />

          {/* Status API */}
          <section id="api">
            <Pill>Developer</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-6">Status API</h2>
            <p className="text-white/60 mb-6">
              Travo exposes a read-only HTTP API that returns live monitoring data. No authentication is required for the public endpoints.
            </p>

            <ApiEndpoint
              method="GET"
              path="/api-routes/status"
              description="Returns all monitored APIs with their latest metric, active incident, and 24h uptime."
            >
              <CodeBlock>{`[
  {
    "id": "clx...",
    "name": "Stripe",
    "slug": "stripe",
    "category": "Payments",
    "latestMetric": {
      "latencyMs": 142,
      "statusCode": 200,
      "success": true,
      "timestamp": "2024-06-01T14:30:00.000Z"
    },
    "activeIncident": null,
    "uptime24h": 99.93
  },
  ...
]`}</CodeBlock>
            </ApiEndpoint>

            <ApiEndpoint
              method="GET"
              path="/api-routes/metrics/:slug"
              description="Returns raw metrics for a specific API over the last 24 hours."
            >
              <CodeBlock>{`{
  "api": { "id": "...", "name": "Stripe", "slug": "stripe" },
  "metrics": [
    {
      "id": "...",
      "latencyMs": 138,
      "statusCode": 200,
      "success": true,
      "timestamp": "2024-06-01T14:25:00.000Z"
    },
    ...
  ]
}`}</CodeBlock>
            </ApiEndpoint>

            <ApiEndpoint
              method="GET"
              path="/api-routes/incidents/:slug"
              description="Returns the last 20 incidents for a specific API."
            >
              <CodeBlock>{`[
  {
    "id": "...",
    "type": "downtime",
    "severity": "critical",
    "message": "Stripe is down: last 3 consecutive checks failed.",
    "startedAt": "2024-06-01T14:00:00.000Z",
    "resolvedAt": "2024-06-01T14:12:00.000Z"
  },
  ...
]`}</CodeBlock>
            </ApiEndpoint>

            <p className="text-xs text-white/30 mt-6">
              Base URL: <code className="text-[#FF5657]">https://app.gettravo.com</code>
            </p>

            <h3 className="text-base font-semibold text-white mt-10 mb-4">Code examples</h3>

            <p className="text-sm text-white/50 mb-3">JavaScript / TypeScript</p>
            <CodeBlock>{`const res = await fetch('https://app.gettravo.com/api-routes/status')
const apis = await res.json()

const stripe = apis.find(a => a.slug === 'stripe')
console.log(stripe.latestMetric.latencyMs) // e.g. 142
console.log(stripe.uptime24h)              // e.g. 99.93
console.log(stripe.activeIncident)         // null or { severity, type }`}</CodeBlock>

            <p className="text-sm text-white/50 mt-6 mb-3">Python</p>
            <CodeBlock>{`import requests

res = requests.get('https://app.gettravo.com/api-routes/status')
apis = res.json()

stripe = next(a for a in apis if a['slug'] == 'stripe')
print(stripe['latestMetric']['latencyMs'])
print(stripe['uptime24h'])
print(stripe['activeIncident'])`}</CodeBlock>

            <p className="text-sm text-white/50 mt-6 mb-3">cURL</p>
            <CodeBlock>{`curl https://app.gettravo.com/api-routes/status
curl https://app.gettravo.com/api-routes/metrics/stripe
curl https://app.gettravo.com/api-routes/incidents/openai`}</CodeBlock>

            <CopyPromptButton />
          </section>

          <Divider />

          {/* FAQ */}
          <section id="faq">
            <Pill>FAQ</Pill>
            <h2 className="text-2xl font-bold text-white mt-4 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is Travo free to use?',
                  a: 'Yes. The Starter plan is completely free and includes the live API status dashboard, basic history, and one personal stack. No credit card required.',
                },
                {
                  q: 'Do I need to install anything?',
                  a: 'No. Travo is entirely browser-based. You sign up, configure your stack, and monitoring starts immediately.',
                },
                {
                  q: 'How often are APIs checked?',
                  a: 'All APIs are checked once per minute, staggered across the 60-second window so checks are distributed evenly.',
                },
                {
                  q: 'How long is data retained?',
                  a: 'Raw metrics are stored for 7 days. The Starter plan shows basic history; Pro and Team plans provide 30–90 day history.',
                },
                {
                  q: 'What APIs does Travo monitor?',
                  a: `Travo monitors ${apiCount}+ APIs across ${categoryCount} categories: ${categories}. The list is continuously growing.`,
                },
                {
                  q: 'How is this different from vendor status pages?',
                  a: 'Vendor status pages are self-reported and often updated with delay or understate the severity of incidents. Travo runs independent synthetic checks from the outside, so you see what your users actually experience.',
                },
              ].map((item) => (
                <div key={item.q} className="border border-white/8 rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-white mb-2">{item.q}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}

// — Sub-components —

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold text-[#FF5657] uppercase tracking-widest">
      {children}
    </span>
  )
}

function Divider() {
  return <div className="border-t border-white/5" />
}

function Steps({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF5657]/15 border border-[#FF5657]/30 flex items-center justify-center text-xs font-bold text-[#FF5657]">
        {n}
      </div>
      <div className="pt-0.5">
        <p className="text-sm font-semibold text-white mb-1">{title}</p>
        <p className="text-sm text-white/50 leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

function DocList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

function DocItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5657] flex-shrink-0" />
      <div>
        <span className="text-sm font-semibold text-white">{title} — </span>
        <span className="text-sm text-white/50">{children}</span>
      </div>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-[#111] border border-white/8 rounded-xl p-4 overflow-auto">
      <pre className="text-xs font-mono text-white/60 whitespace-pre leading-relaxed">{children}</pre>
    </div>
  )
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#FF5657] hover:underline">
      {children}
    </a>
  )
}

function ApiEndpoint({
  method,
  path,
  description,
  children,
}: {
  method: string
  path: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded font-mono">
          {method}
        </span>
        <code className="text-sm text-white font-mono">{path}</code>
      </div>
      <p className="text-sm text-white/50 mb-3">{description}</p>
      {children}
    </div>
  )
}
