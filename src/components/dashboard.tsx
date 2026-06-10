"use client";

import { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, BadgeInfo, Building2, CheckCircle2, ChevronRight, Globe, MessageSquareText, Search, Sparkles, Star, TrendingUp } from 'lucide-react';
import { buildDashboard, composeResponse } from '@/lib/analysis';
import { BusinessInput, DashboardData, ReviewItem } from '@/lib/types';

const reviewDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

function MetricCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint: string; icon: typeof Building2 }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment: ReviewItem['sentiment'] }) {
  const styles = {
    positive: 'bg-emerald-100 text-emerald-700',
    neutral: 'bg-amber-100 text-amber-700',
    negative: 'bg-rose-100 text-rose-700'
  } as const;

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[sentiment]}`}>{sentiment}</span>;
}

function ReviewRow({ review, response }: { review: ReviewItem; response: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{review.title}</p>
          <p className="text-xs text-slate-500">{review.source} · {review.author} · {reviewDateFormatter.format(new Date(review.timestamp))}</p>
        </div>
        <div className="flex items-center gap-2">
          {review.rating ? <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"><Star className="h-3 w-3 fill-current" /> {review.rating}/5</span> : null}
          <SentimentBadge sentiment={review.sentiment} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{review.text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {review.topics.map((topic) => (
          <span key={topic} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{topic}</span>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><MessageSquareText className="h-4 w-4 text-brand-600" /> Suggested response</div>
        {response}
      </div>
    </div>
  );
}

export function Dashboard() {
  const [businessName, setBusinessName] = useState('Bombay Canteen');
  const [location, setLocation] = useState('Mumbai');
  const [website, setWebsite] = useState('');
  const [activeSource, setActiveSource] = useState<'All' | 'Google' | 'Zomato' | 'TripAdvisor' | 'Swiggy' | 'Reddit' | 'Blog'>('All');
  const [submittedInput, setSubmittedInput] = useState<BusinessInput>({ businessName: 'Bombay Canteen', location: 'Mumbai', website: '' });

  const dashboard = useMemo<DashboardData>(() => buildDashboard(submittedInput), [submittedInput]);

  const filteredReviews = activeSource === 'All'
    ? dashboard.recentReviews
    : dashboard.recentReviews.filter((review) => review.source === activeSource);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(29,124,255,0.14),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#f5efe6_100%)] text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/60 bg-slate-950 p-8 text-white shadow-soft">
            <div className="flex items-center gap-3 text-brand-200">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-[0.2em]">OnShore Labs MVP</span>
            </div>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">AI-powered reputation intelligence for restaurants and hotels.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Aggregate public mentions, classify sentiment, summarize feedback, and generate brand-safe suggested responses from a single dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Mock connectors for public sources</div>
              <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2">AI-style sentiment and topic extraction</div>
              <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2">Actionable recommendations</div>
            </div>
          </div>

          <form
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedInput({ businessName: businessName.trim() || 'Untitled business', location: location.trim() || 'Unknown location', website: website.trim() });
              setActiveSource('All');
            }}
          >
            <div className="flex items-center gap-2 text-slate-700">
              <Search className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Search a business</h2>
            </div>
            <p className="mt-2 text-sm text-slate-500">Enter a business name and city to generate a reputation dashboard.</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Business name</span>
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-200 focus:ring-4" value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">City / location</span>
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-200 focus:ring-4" value={location} onChange={(event) => setLocation(event.target.value)} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Optional website or platform URL</span>
                <input className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-200 focus:ring-4" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://..." />
              </label>
            </div>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-brand-700">
              Generate dashboard <ChevronRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              Current results are for <span className="font-semibold text-slate-700">{submittedInput.businessName}</span> in <span className="font-semibold text-slate-700">{submittedInput.location}</span>.
            </p>
          </form>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total mentions" value={dashboard.totalMentions} hint="Aggregated from mock public sources" icon={BarChart3} />
          <MetricCard label="Average rating" value={dashboard.averageRating} hint="Only available when rating exists" icon={Star} />
          <MetricCard label="Urgent reviews" value={dashboard.urgentReviews.length} hint="Need response soon" icon={AlertTriangle} />
          <MetricCard label="Sources tracked" value={Object.keys(dashboard.sourceCounts).length} hint="Modular source architecture" icon={Globe} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Sentiment overview</h2>
                <p className="text-sm text-slate-500">Positive, neutral, and negative split for {submittedInput.businessName}.</p>
              </div>
              <BadgeInfo className="h-5 w-5 text-brand-600" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {(['positive', 'neutral', 'negative'] as const).map((sentiment) => (
                <div key={sentiment} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm capitalize text-slate-500">{sentiment}</p>
                  <p className="mt-2 text-3xl font-semibold">{dashboard.sentimentCounts[sentiment]}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold">AI summary</h3>
              <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <p>{dashboard.summary.overall}</p>
                <p><strong className="text-slate-900">Positive:</strong> {dashboard.summary.positive}</p>
                <p><strong className="text-slate-900">Neutral:</strong> {dashboard.summary.neutral}</p>
                <p><strong className="text-slate-900">Negative:</strong> {dashboard.summary.negative}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Source-wise breakdown</h2>
                <p className="text-sm text-slate-500">Track multiple public platforms in one view.</p>
              </div>
              <Building2 className="h-5 w-5 text-brand-600" />
            </div>
            <div className="mt-5 grid gap-3">
              {Object.entries(dashboard.sourceCounts).map(([source, count]) => (
                <button key={source} onClick={() => setActiveSource(source as typeof activeSource)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${activeSource === source ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <span className="font-medium text-slate-800">{source}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Recent reviews</h2>
                <p className="text-sm text-slate-500">Filtered by {activeSource}.</p>
              </div>
              <TrendingUp className="h-5 w-5 text-brand-600" />
            </div>
            <div className="mt-5 grid gap-4">
              {filteredReviews.map((review) => (
                <ReviewRow key={review.id} review={review} response={composeResponse(review)} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold">Most repeated complaints</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {dashboard.topComplaints.map((complaint) => (
                  <span key={complaint} className="rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">{complaint}</span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold">Most repeated compliments</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {dashboard.topCompliments.map((compliment) => (
                  <span key={compliment} className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{compliment}</span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold">Recommendations engine</h2>
              <div className="mt-4 space-y-3">
                {dashboard.summary.recommendations.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Urgent reviews needing response</h2>
              <p className="text-sm text-slate-500">High-priority reviews surfaced for operational follow-up.</p>
            </div>
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">{dashboard.urgentReviews.length} flagged</span>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {dashboard.urgentReviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-rose-200 bg-rose-50 p-5">
                <p className="font-semibold text-rose-900">{review.title}</p>
                <p className="mt-2 text-sm leading-6 text-rose-800">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
