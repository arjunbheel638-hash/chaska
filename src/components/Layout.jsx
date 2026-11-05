import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Compass, Home, LogOut, Menu, Plus, Search, UserRound, X, Flame } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', label: 'For you', icon: Home },
  { to: '/trending', label: 'Trending', icon: Flame },
  { to: '/search', label: 'Explore', icon: Compass }
];

export default function Layout({ children }) {
  const { user, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);
  const doSignOut = async () => { await signOut(auth); closeMenu(); navigate('/'); };
  const navClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;
  return <div className="min-h-screen bg-ink text-white">
    <header className="sticky top-0 z-40 border-b border-white/[.07] bg-ink/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7">
        <div className="flex items-center gap-10"><button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Toggle menu">{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button><Link to="/" className="font-display text-[25px] font-bold tracking-[-1.5px]">CHASKA<span className="text-accent">.</span></Link>
          <form onSubmit={e => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); navigate(`/search?q=${encodeURIComponent(q)}`); }} className="hidden h-10 w-[340px] items-center gap-3 rounded-full border border-white/10 bg-white/[.04] px-4 md:flex"><Search size={16} className="text-zinc-500"/><input name="q" placeholder="Search videos, creators..." className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"/><kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-600">⌘ K</kbd></form>
        </div>
        <div className="flex items-center gap-3"><Link to="/search" className="rounded-full p-2 text-zinc-400 hover:bg-white/5 md:hidden" aria-label="Search"><Search size={20}/></Link><Link to="/upload" className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-ink transition hover:bg-white"><Plus size={16}/> <span className="hidden sm:inline">Create</span></Link>{user ? <div className="group relative"><Link to={`/profile/${user.uid}`} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-800 text-sm font-bold text-accent">{profile?.photoURL ? <img src={profile.photoURL} className="h-full w-full object-cover"/> : (profile?.name || user.email || 'C').slice(0,1).toUpperCase()}</Link><button onClick={doSignOut} className="absolute right-0 top-11 hidden items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-panel px-3 py-2 text-xs text-zinc-300 shadow-xl group-hover:flex"><LogOut size={14}/> Sign out</button></div> : <Link to="/login" className="rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold transition hover:border-accent hover:text-accent">Log in</Link>}</div>
      </div>
      {menuOpen && <div className="absolute left-0 right-0 border-b border-white/10 bg-panel px-4 py-3 shadow-xl lg:hidden">{nav.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={navClass} onClick={closeMenu}><Icon size={18}/>{label}</NavLink>)}</div>}
    </header>
    <div className="mx-auto flex max-w-[1440px]">
      <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[230px] shrink-0 flex-col border-r border-white/[.07] px-4 py-7 lg:flex">{nav.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={navClass}><Icon size={19}/>{label}</NavLink>)}<div className="my-6 border-t border-white/[.07]"/><p className="px-3 text-[10px] font-bold uppercase tracking-[.2em] text-zinc-600">Your space</p>{user ? <NavLink to={`/profile/${user.uid}`} className={navClass}><UserRound size={19}/>My channel</NavLink> : <p className="px-3 py-4 text-xs leading-5 text-zinc-500">Log in to build your channel and follow creators.</p>}<div className="mt-auto rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><div className="mb-2 h-1.5 w-8 rounded-full bg-accent"/><p className="font-display text-sm font-semibold">A little more feeling.</p><p className="mt-1 text-[11px] leading-5 text-zinc-500">Discover the videos people can’t stop sharing.</p></div></aside>
      <main className="min-h-[calc(100vh-72px)] min-w-0 flex-1 px-4 pb-24 pt-7 sm:px-7 lg:px-10 lg:pb-10">{children}</main>
    </div>
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-white/10 bg-ink/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">{nav.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={({isActive}) => `flex min-w-[64px] flex-col items-center gap-1 px-3 py-1 text-[10px] ${isActive ? 'text-accent' : 'text-zinc-500'}`}><Icon size={20}/>{label}</NavLink>)}<Link to={user ? `/profile/${user.uid}` : '/login'} className="flex min-w-[64px] flex-col items-center gap-1 px-3 py-1 text-[10px] text-zinc-500"><UserRound size={20}/>You</Link></nav>
  </div>;
}
