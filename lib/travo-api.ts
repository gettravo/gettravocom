const API_BASE = process.env.TRAVO_API_URL ?? 'https://app.gettravo.com'

export interface ApiStatus {
  id: string
  name: string
  slug: string
  category: string
  latestMetric: { latencyMs: number; success: boolean; statusCode: number } | null
  activeIncident: { severity: string; type: string } | null
  uptime24h: number | null
}

export interface RawMetric {
  id: string
  latencyMs: number
  success: boolean
  timestamp: string
}

export type LiveStatus = 'operational' | 'degraded' | 'down' | 'unknown'

export function getStatus(api: ApiStatus): LiveStatus {
  if (!api.latestMetric) return 'unknown'
  if (!api.latestMetric.success) return 'down'
  if (api.activeIncident?.severity === 'critical') return 'down'
  if (api.activeIncident) return 'degraded'
  return 'operational'
}

export function statusLabel(s: LiveStatus) {
  return { operational: 'Healthy', degraded: 'Degraded', down: 'Outage', unknown: 'No data' }[s]
}

export function statusColor(s: LiveStatus) {
  return {
    operational: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-[#FF5657]',
    unknown: 'bg-white/20',
  }[s]
}

export async function fetchAllStatus(): Promise<ApiStatus[]> {
  try {
    const res = await fetch(`${API_BASE}/api-routes/status`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function fetchMetrics(slug: string): Promise<RawMetric[]> {
  try {
    const res = await fetch(`${API_BASE}/api-routes/metrics/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.metrics ?? []
  } catch {
    return []
  }
}

/** Bucket metrics into N equal-width bars across the 24h window */
export function bucketLatency(metrics: RawMetric[], buckets = 27): number[] {
  if (metrics.length === 0) return Array(buckets).fill(0)

  const now = Date.now()
  const windowMs = 24 * 60 * 60 * 1000
  const bucketMs = windowMs / buckets

  const sums = Array(buckets).fill(0)
  const counts = Array(buckets).fill(0)

  for (const m of metrics) {
    const age = now - new Date(m.timestamp).getTime()
    if (age > windowMs) continue
    const idx = Math.min(buckets - 1, Math.floor((windowMs - age) / bucketMs))
    sums[idx] += m.latencyMs
    counts[idx]++
  }

  return sums.map((s, i) => (counts[i] > 0 ? Math.round(s / counts[i]) : 0))
}
