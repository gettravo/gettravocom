'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

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
  { id: 'teams', label: 'Teams' },
  { id: 'faq', label: 'FAQ' },
]

export default function DocsSidebar() {
  const [activeId, setActiveId] = useState<string>('introduction')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-28">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">On this page</p>
        <nav className="space-y-1">
          {sections.map((s) => {
            const isActive = activeId === s.id
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`flex items-center gap-2 text-sm py-1.5 group transition-colors ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                <ChevronRight
                  className={`w-3 h-3 text-[#FF5657] transition-all ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
                <span className={isActive ? 'text-white' : ''}>{s.label}</span>
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
