import React from 'react';
import Link from 'next/link';
import {
  Zap,
  Bell,
  BarChart3,
  Layers,
  Github,
  History,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Monitor,
  Activity,
} from 'lucide-react';
import AnoAI from "@/components/ui/animated-shader-background";
import {
  fetchAllStatus,
  fetchMetrics,
  bucketLatency,
  getStatus,
  statusLabel,
  statusColor,
  type ApiStatus,
} from '@/lib/travo-api';

export const revalidate = 60;

// APIs to feature — must match slugs in travo-dash
const FEATURED_SLUGS = ['stripe', 'openai', 'github', 'cloudflare'];
const CHART_SLUG = 'stripe'; // which API drives the latency chart

export default async function LandingPage() {
  const [allApis, chartMetrics] = await Promise.all([
    fetchAllStatus(),
    fetchMetrics(CHART_SLUG),
  ]);

  // Pick featured APIs in defined order, fall back to mock if API unavailable
  const featuredApis: (ApiStatus & { logo: string })[] = FEATURED_SLUGS.map((slug) => {
    const logos: Record<string, string> = {
      stripe: '/stripeicon.svg',
      openai: '/openaiicon.svg',
      github: '/githubicon.svg',
      cloudflare: '/cloudflareicon.svg',
    };
    const found = allApis.find((a) => a.slug === slug);
    if (found) return { ...found, logo: logos[slug] };
    // fallback
    return {
      id: slug, name: slug.charAt(0).toUpperCase() + slug.slice(1), slug,
      category: '', logo: logos[slug],
      latestMetric: null, activeIncident: null, uptime24h: null,
    };
  });

  // Dashboard stats: avg latency + overall uptime across all fetched APIs
  const apisWithMetrics = allApis.filter((a) => a.latestMetric);
  const avgLatency = apisWithMetrics.length > 0
    ? Math.round(apisWithMetrics.reduce((s, a) => s + (a.latestMetric!.latencyMs), 0) / apisWithMetrics.length)
    : 42;
  const apisWithUptime = allApis.filter((a) => a.uptime24h !== null);
  const avgUptime = apisWithUptime.length > 0
    ? (apisWithUptime.reduce((s, a) => s + a.uptime24h!, 0) / apisWithUptime.length).toFixed(2)
    : '99.98';

  // Latency chart data
  const latencyBuckets = bucketLatency(chartMetrics, 27);
  const maxLatency = Math.max(...latencyBuckets, 1);
  // threshold for "spike" coloring: 2× average
  const avgBucket = latencyBuckets.filter(Boolean).reduce((s, v) => s + v, 0) / (latencyBuckets.filter(Boolean).length || 1);
  const spikeThreshold = avgBucket * 2;

  const features = [
    {
      title: "Real-time API health monitoring",
      description: "Travo continuously checks popular developer APIs and measures latency, error rates and uptime so you can instantly see when something goes wrong.",
      icon: <Activity className="w-6 h-6" />
    },
    {
      title: "Monitor your own API stack",
      description: "Select the services your app depends on and track their health in one place. Quickly see whether an issue comes from your code or an external provider.",
      icon: <Layers className="w-6 h-6" />
    },
    {
      title: "Automatic stack detection",
      description: "Connect a GitHub repository and Travo analyzes common dependency files to detect the APIs and services used in your project. No manual setup required.",
      icon: <Github className="w-6 h-6" />
    },
    {
      title: "Instant alerts",
      description: "Get notified when an API becomes unstable or unavailable. Alerts can be sent via webhooks or directly through HookTap.",
      icon: <Bell className="w-6 h-6" />
    }
  ];

  const pricing = [
    {
      name: "Free",
      price: "0",
      description: "For developers and hobby projects",
      features: [
        "Dashboard with all public APIs",
        "Services overview — status, latency, uptime",
        "Incidents feed",
        "1 Stack (up to 5 APIs)",
        "24h metric history",
        "Email alerts",
        "GitHub Auto-Detection (public repos)"
      ],
      cta: "Start for free",
      highlight: false
    },
    {
      name: "Pro",
      price: "9",
      description: "For teams and production apps",
      features: [
        "Unlimited stack size",
        "7-day metric history",
        "Teams — shared stack, shared alerts, invite members",
        "Webhook & HookTap push notification alerts",
        "Private GitHub repos for Auto-Detection",
        "iOS App with home screen widget"
      ],
      cta: "Try Pro",
      highlight: true
    }
  ];

  const faqs = [
    {
      q: "What does Travo monitor?",
      a: "Travo monitors the health of popular developer APIs such as Stripe, OpenAI, GitHub and other commonly used services."
    },
    {
      q: "How does Travo detect API issues?",
      a: "Travo continuously performs synthetic API checks and measures response times, error rates and availability. If unusual spikes or failures occur, the system automatically detects an incident."
    },
    {
      q: "How is this different from a status page?",
      a: "Status pages are maintained by the service providers themselves and often update with delay. Travo provides independent monitoring and real-time metrics."
    },
    {
      q: "Can Travo detect the APIs used in my project?",
      a: "Yes. You can connect a GitHub repository and Travo analyzes common dependency files to detect services used by your project."
    },
    {
      q: "How do alerts work?",
      a: "When Travo detects an outage, increased error rate or unusual latency, alerts can be sent via webhooks or through HookTap."
    },
    {
      q: "Do I need to install anything?",
      a: "No installation is required for basic monitoring. You can simply create a stack and select the APIs you want to track."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] selection:bg-[#FF5657]/30">
      {/* Announcement Bar */}
      <div className="relative z-[60] bg-[#FF5657] py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            New: Now supporting Private and Public GitHub Repositories
          </span>
          <Link href="https://app.gettravo.com" className="bg-white text-[#FF5657] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full hover:bg-white/90 transition-all shadow-sm">
            Try it now
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/whitelogo.png" alt="Travo Logo" className="h-6 w-auto" />
          </Link>
          <div className="hidden space-x-8 md:flex">
            <Link href="#problem" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Why Travo?</Link>
            <Link href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-white/60 hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://app.gettravo.com" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Log in</Link>
            <Link href="https://app.gettravo.com" className="rounded-full bg-[#FF5657] px-5 py-2 text-sm font-semibold text-white hover:bg-[#FF5657]/90 transition-all shadow-sm active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 min-h-[80vh] flex flex-col justify-center z-0">
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
          <AnoAI />
        </div>
        <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] bg-[#FF5657]/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#FF5657] mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5657] animate-pulse" />
            Travo: Independent API Monitoring
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl leading-tight">
            Know when the APIs your app depends on <span className="text-[#FF5657]">break.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/60">
            Travo monitors the health of critical developer APIs like Stripe, OpenAI, GitHub and more — tracking latency, errors and outages in real time.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="https://app.gettravo.com" className="rounded-full bg-[#FF5657] px-8 py-4 text-sm font-semibold text-white hover:bg-[#FF5657]/90 transition-all shadow-xl shadow-[#FF5657]/20 active:scale-95">
              Start monitoring your stack
            </Link>
            <Link href="#dashboard" className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all active:scale-95">
              View live API status
            </Link>
          </div>

        {/* Live API Stack Preview Card */}
        <div className="mx-auto mt-20 max-w-5xl px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Live API Status</span>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-white/30 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredApis.map((api) => {
                const s = getStatus(api);
                return (
                  <div key={api.slug} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <img
                          src={api.logo}
                          alt={api.name}
                          className="max-w-full max-h-full object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-all"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-[#FF5657] transition-colors">{api.name}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-wider">{statusLabel(s)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-white/60">
                        {api.latestMetric ? `${api.latestMetric.latencyMs}ms` : '—'}
                      </div>
                      <div className={`mt-1 h-1 w-full rounded-full ${statusColor(s)} opacity-80`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-32 border-y border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h2 className="text-[#FF5657] font-semibold tracking-wide uppercase text-sm mb-4">Problem</h2>
            <h3 className="text-4xl font-bold text-white mb-8 leading-tight">Your app depends on APIs you don&apos;t control.</h3>
            <div className="space-y-6 text-lg text-white/60">
              <p>Modern apps rely on dozens of external services. When one of them slows down or goes down, your app breaks — but it&apos;s often hard to tell why.</p>
              <p>Status pages are slow to update and logs rarely show the full picture. Travo gives you an independent view of API health so you can quickly understand what&apos;s happening.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-b border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-semibold text-white/20 uppercase tracking-[0.2em] mb-8">Monitoring critical developer infrastructure</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {[
              { src: "/logos/stripe.svg", alt: "Stripe" },
              { src: "/logos/openai.svg", alt: "OpenAI" },
              { src: "/logos/github.svg", alt: "GitHub" },
              { src: "/logos/cloudflare.svg", alt: "Cloudflare" },
              { src: "/logos/shopify.svg", alt: "Shopify" },
              { src: "/logos/vercel.svg", alt: "Vercel" }
            ].map((logo) => (
              <div key={logo.alt} className="flex justify-center items-center h-10 w-full px-4">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-[#FF5657] font-semibold tracking-wide uppercase text-sm mb-4">Features</h2>
            <h3 className="text-4xl font-bold text-white mb-6 leading-tight">Everything you need for API monitoring.</h3>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Travo provides independent data and intelligent analysis for your entire software stack.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-10 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:border-[#FF5657]/20">
                <div className="w-12 h-12 rounded-xl bg-[#FF5657]/10 flex items-center justify-center text-[#FF5657] mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-white/40 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section — real data */}
      <section id="dashboard" className="py-32 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[#FF5657] font-semibold tracking-wide uppercase text-sm mb-4">Dashboard</h2>
          <h3 className="text-4xl font-bold text-white mb-6 leading-tight">See the health of your stack at a glance</h3>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-16">
            The Travo dashboard shows real-time API status, performance metrics and historical trends so you can quickly identify incidents and performance degradation.
          </p>

          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-[#FF5657]/10 blur-[120px] -z-10" />
            <div className="rounded-3xl border border-white/10 bg-black p-8 shadow-2xl overflow-hidden text-left">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-white/40" />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Production API Stack</h5>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">
                      Active Monitoring · {apisWithMetrics.length} Services
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="https://app.gettravo.com" className="px-4 py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-all">Edit Stack</Link>
                  <Link href="https://app.gettravo.com" className="px-4 py-2 rounded-lg bg-[#FF5657] text-xs text-white font-semibold shadow-lg shadow-[#FF5657]/20">Add API</Link>
                </div>
              </div>

              {/* Real latency chart (Stripe 24h) */}
              <div className="mb-2">
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-3">
                  Stripe — Latency 24h
                </p>
              </div>
              <div className="flex justify-between items-end h-48 gap-1 mb-8">
                {latencyBuckets.map((ms, i) => {
                  const heightPct = ms > 0 ? Math.max(4, (ms / maxLatency) * 100) : 4;
                  const isSpike = ms > spikeThreshold && ms > 0;
                  return (
                    <div
                      key={i}
                      className={`w-full rounded-t-sm transition-all duration-1000 ${
                        isSpike
                          ? 'bg-[#FF5657] shadow-[0_0_10px_rgba(255,86,87,0.5)]'
                          : ms > 0 ? 'bg-white/10' : 'bg-white/5'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={ms > 0 ? `${ms}ms` : 'No data'}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs text-white/40">Avg Latency (all APIs)</span>
                    <Zap className="w-3 h-3 text-[#FF5657]" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{avgLatency}ms</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs text-white/40">Avg Uptime (24h)</span>
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{avgUptime}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-[#FF5657] font-semibold tracking-wide uppercase text-sm mb-4">Process</h2>
            <h3 className="text-4xl font-bold text-white">How it works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Continuous monitoring",
                desc: "Travo performs synthetic checks against supported APIs from multiple locations.",
                icon: <Activity className="w-6 h-6" />
              },
              {
                step: "2",
                title: "Metrics & incident detection",
                desc: "Latency spikes, error increases and outages are automatically detected.",
                icon: <AlertCircle className="w-6 h-6" />
              },
              {
                step: "3",
                title: "Alerts and insights",
                desc: "You get notified immediately and can investigate the issue using historical metrics.",
                icon: <History className="w-6 h-6" />
              }
            ].map((item, i) => (
              <div key={i} className="relative p-8">
                <div className="absolute top-0 left-0 text-6xl font-black text-white/5 -translate-y-4">{item.step}</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#FF5657]/10 flex items-center justify-center text-[#FF5657] mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-[#FF5657] font-semibold tracking-wide uppercase text-sm mb-4">Integrations</h2>
              <h3 className="text-4xl font-bold text-white mb-6">Native Alerts & Integrations</h3>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Get notified the way you want. Travo supports native Email and Webhook alerts, or use{' '}
                <span className="text-white font-semibold underline decoration-[#FF5657]/40">HookTap</span>{' '}
                — the iOS app that turns webhooks into instant push notifications and Home Screen widgets without even requiring an account.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-white/60">
                  <Zap className="w-3 h-3 text-[#FF5657]" /> Webhooks
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-white/60">
                  <Bell className="w-3 h-3 text-[#FF5657]" /> Email
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                  <Plus className="w-3 h-3 text-[#FF5657]" /> HookTap
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="https://hooktap.me" target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all border border-white/10">
                  Learn more about HookTap
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="relative p-12 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-12">
                  <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl">
                    <img src="/whitelogo.png" alt="Travo" className="w-12 h-auto" />
                  </div>
                  <div className="relative w-16 h-px bg-white/10">
                    <div className="absolute inset-0 bg-[#FF5657] animate-pulse" />
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden p-4">
                    <img src="/hooktap-icon.png" alt="HookTap" className="w-full h-auto object-contain" />
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-[#FF5657] text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap shadow-xl">
                  Native Integration
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[#FF5657] font-semibold tracking-wide uppercase text-sm mb-4">Pricing</h2>
          <h3 className="text-4xl font-bold text-white mb-6">Simple pricing for your API stack</h3>
          <p className="text-white/60 max-w-2xl mx-auto mb-16">Choose the plan that fits your current stage.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, i) => (
              <div key={i} className={`relative p-10 rounded-[2.5rem] border transition-all ${plan.highlight ? 'bg-white/5 border-[#FF5657] shadow-2xl shadow-[#FF5657]/10' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FF5657] text-white text-[10px] font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="text-xl font-bold text-white mb-2">{plan.name}</div>
                <div className="flex items-baseline justify-center gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  {plan.price !== '0' && <span className="text-white/40 text-sm">/ month</span>}
                </div>
                <p className="text-white/40 text-sm mb-8 h-10">{plan.description}</p>
                <div className="space-y-4 mb-10 text-left">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5657] mt-0.5 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link href="https://app.gettravo.com" className={`w-full py-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] text-center block ${plan.highlight ? 'bg-[#FF5657] text-white hover:bg-[#FF5657]/90 shadow-lg shadow-[#FF5657]/20' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-[#FF5657] font-semibold tracking-wide uppercase text-sm mb-4">FAQ</h2>
            <h3 className="text-4xl font-bold text-white">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <HelpCircle className="w-5 h-5 text-[#FF5657]/60" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">{faq.q}</h4>
                    <p className="text-white/40 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="max-w-4xl mx-auto rounded-[3rem] border border-white/5 bg-white/[0.02] p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 bg-[#FF5657]/10 blur-[100px] -rotate-12 translate-x-32 -translate-y-32" />
            <h2 className="text-4xl font-bold text-white sm:text-6xl mb-8 relative z-10">Stop guessing when APIs fail.</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/60 mb-12 relative z-10">
              Monitor the services your app depends on and get notified when something breaks.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 relative z-10">
              <Link href="https://app.gettravo.com" className="rounded-full bg-[#FF5657] px-8 py-4 text-sm font-semibold text-white hover:bg-[#FF5657]/90 transition-all shadow-xl shadow-[#FF5657]/20 active:scale-95">
                Start monitoring your stack
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-24 pb-12 bg-black">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
            <div className="col-span-2">
              <Link href="/" className="inline-block mb-2">
                <img src="/whitelogo.png" alt="Travo Logo" className="h-6 w-auto" />
              </Link>
              <div className="mb-6">
                <Link href="https://hooktap.me" target="_blank" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors">
                  A HookTap Product
                </Link>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
                Independent API health monitoring for the modern stack. Know when your dependencies break, before your users do.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#features" className="text-sm text-white/40 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#dashboard" className="text-sm text-white/40 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="#pricing" className="text-sm text-white/40 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="https://app.gettravo.com" className="text-sm text-white/40 hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/docs" className="text-sm text-white/40 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/docs#api" className="text-sm text-white/40 hover:text-white transition-colors">API Reference</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link href="https://hooktap.me" target="_blank" className="text-sm text-white/40 hover:text-white transition-colors">About HookTap</Link></li>
                <li><Link href="https://hooktap.me/en/privacy" target="_blank" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="https://hooktap.me/en/imprint">Imprint</Link></li>
                <li><Link href="https://hooktap.me/en/terms" target="_blank" className="text-sm text-white/40 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/20">© {new Date().getFullYear()} HookTap Inc. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-white/40 uppercase tracking-widest">
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
