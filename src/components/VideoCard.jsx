import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, arrayUnion, arrayRemove, addDoc, serverTimestamp } from 'firebase/firestore';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Send, X } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const count = n => new Intl.NumberFormat('en', { notation: n > 999 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(n || 0);
const timeAgo = value => { const date = value?.toDate ? value.toDate() : value ? new Date(value) : null; if (!date) return 'just now'; const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000); if (seconds < 60) return 'now'; if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`; if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`; return `${Math.floor(seconds / 86400)}d ago`; };

export function useVideos({ order = 'new' } = {}) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!db) { setLoading(false); return undefined; }
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snapshot => { const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() })); setVideos(order === 'trend' ? list.sort((a,b) => (b.likes?.length || 0) - (a.likes?.length || 0)) : list); setLoading(false); }, error => { console.error(error); setLoading(false); });
  }, [order]);
  return { videos, loading };
}

export function EmptyState({ title = 'Nothing here yet', text = 'Check back soon for fresh videos.' }) { return <div className="rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent"><Play size={22} fill="currentColor"/></div><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm text-zinc-500">{text}</p></div>; }

export default function VideoCard({ video }) {
  const { user } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const likes = video.likes || [];
  const liked = user && likes.includes(user.uid);
  useEffect(() => {
    if (!db || !commentsOpen) return undefined;
    return onSnapshot(query(collection(db, 'videos', video.id, 'comments'), orderBy('createdAt', 'asc')), snap => setComments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [commentsOpen, video.id]);
  const toggleLike = async () => { if (!user) { window.location.href = '/login'; return; } if (busy) return; setBusy(true); try { await updateDoc(doc(db, 'videos', video.id), { likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid) }); } catch (e) { console.error(e); } finally { setBusy(false); } };
  const submitComment = async e => { e.preventDefault(); if (!user || !comment.trim()) return; await addDoc(collection(db, 'videos', video.id, 'comments'), { userId: user.uid, userName: user.displayName || user.email?.split('@')[0] || 'Creator', text: comment.trim(), createdAt: serverTimestamp() }); setComment(''); };
  const share = async () => { const url = `${window.location.origin}/?v=${video.id}`; try { await navigator.clipboard.writeText(url); alert('Video link copied!'); } catch { window.prompt('Copy this link', url); } };
  return <article className="overflow-hidden rounded-[24px] border border-white/[.08] bg-panel transition hover:border-white/[.14]">
    <div className="flex items-center justify-between px-4 py-4 sm:px-5"><Link to={`/profile/${video.ownerId}`} className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-orange-400 text-sm font-bold text-ink">{video.ownerPhoto ? <img src={video.ownerPhoto} className="h-full w-full object-cover"/> : (video.ownerName || 'C').slice(0,1).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{video.ownerName || 'CHASKA creator'}</p><p className="text-[11px] text-zinc-500">{timeAgo(video.createdAt)}{video.category ? ` · ${video.category}` : ''}</p></div></Link><button className="rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white" aria-label="More options"><MoreHorizontal size={19}/></button></div>
    <div className="relative aspect-video bg-black">{playing ? <video src={video.videoURL} controls autoPlay className="h-full w-full" poster={video.thumbnailURL || undefined}/> : <button onClick={() => setPlaying(true)} className="group relative h-full w-full text-left" aria-label={`Play ${video.title}`}><img src={video.thumbnailURL || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80`} alt={video.title} className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"/><span className="absolute inset-0 grid place-items-center bg-black/10"><span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-accent group-hover:text-ink"><Play size={22} fill="currentColor" className="ml-1"/></span></span></button>}</div>
    <div className="px-4 pb-4 pt-4 sm:px-5"><Link to={`/?v=${video.id}`} className="font-display text-lg font-bold leading-snug hover:text-accent">{video.title}</Link>{video.description && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-zinc-400">{video.description}</p>}
      <div className="mt-4 flex items-center gap-2 border-t border-white/[.07] pt-3"><button disabled={busy} onClick={toggleLike} className={`action-button ${liked ? 'text-rose-400' : ''}`}><Heart size={18} fill={liked ? 'currentColor' : 'none'}/><span>{count(likes.length)}</span></button><button onClick={() => setCommentsOpen(!commentsOpen)} className="action-button"><MessageCircle size={18}/><span>{count(video.commentCount || 0)}</span></button><button onClick={share} className="action-button"><Share2 size={17}/><span className="hidden sm:inline">Share</span></button><span className="ml-auto flex items-center gap-1 text-[11px] text-zinc-600"><Play size={13}/>{count(video.views || 0)} views</span></div>
    </div>
    {commentsOpen && <div className="border-t border-white/[.07] bg-black/20 px-4 py-4 sm:px-5"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Comments</p><button onClick={() => setCommentsOpen(false)} className="text-zinc-600 hover:text-white"><X size={16}/></button></div><div className="max-h-48 space-y-3 overflow-y-auto">{comments.length ? comments.map(c => <div key={c.id} className="text-sm"><span className="mr-2 font-semibold">{c.userName || 'Creator'}</span><span className="text-zinc-400">{c.text}</span></div>) : <p className="text-xs text-zinc-600">Be the first to share a thought.</p>}</div><form onSubmit={submitComment} className="mt-4 flex gap-2"><input value={comment} onChange={e => setComment(e.target.value)} placeholder={user ? 'Add a comment...' : 'Log in to comment'} disabled={!user} className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs outline-none focus:border-accent/50"/><button disabled={!user || !comment.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-ink disabled:opacity-40"><Send size={15}/></button></form></div>}
  </article>;
}
