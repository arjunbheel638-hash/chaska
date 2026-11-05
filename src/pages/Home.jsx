import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import VideoCard, { EmptyState, useVideos } from '../components/VideoCard';

export default function Home() {
  const { videos, loading } = useVideos();
  return <div className="mx-auto max-w-[880px]">
    <section className="relative mb-8 overflow-hidden rounded-[28px] border border-white/[.08] bg-gradient-to-br from-[#24251c] via-[#181818] to-[#181818] px-6 py-7 sm:px-9 sm:py-9"><div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-[80px]"/><div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-accent"><Sparkles size={12}/> Your daily scroll, upgraded</div><h1 className="max-w-lg font-display text-3xl font-bold leading-tight tracking-[-1px] sm:text-[42px]">Video, with a<br className="hidden sm:block"/> little more <span className="text-accent">feeling.</span></h1><p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">The good stuff, from the people worth watching. Find your next favorite moment.</p></div><Link to="/trending" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold transition hover:border-accent hover:text-accent sm:self-auto">See what’s trending <ArrowUpRight size={14}/></Link></div></section>
    <div className="mb-5 flex items-end justify-between"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.2em] text-zinc-600">Fresh from the community</p><h2 className="font-display text-xl font-bold">Your feed</h2></div><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-zinc-500">Latest</span></div>
    <div className="space-y-5">{loading ? <div className="h-72 animate-pulse rounded-3xl bg-panel"/> : videos.length ? videos.map(video => <VideoCard key={video.id} video={video}/>) : <EmptyState title="The first frame is yours" text="Share a video to start the CHASKA feed."/>}</div>
  </div>;
}
