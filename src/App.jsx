import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Trending from './pages/Trending';
import Search from './pages/Search';
import { firebaseConfigured } from './firebase';

function SetupNotice() {
  return <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-white/10 bg-panel p-8 text-center"><div className="mb-3 text-3xl">⚡</div><h2 className="font-display text-2xl font-bold">Connect your Firebase project</h2><p className="mt-3 text-sm leading-6 text-zinc-400">CHASKA is ready to run. Add your Firebase web app settings to <code className="rounded bg-white/10 px-1.5 py-0.5">.env.local</code>, then enable Email/Password Auth, Firestore, and Storage in Firebase Console.</p><p className="mt-4 text-xs text-zinc-500">See README.md for setup instructions.</p></div>;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-ink text-accent"><div className="animate-pulse font-display text-3xl font-bold tracking-tight">CHASKA<span className="text-white">.</span></div></div>;
  return <Layout><Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Auth />} /><Route path="/signup" element={<Auth signup />} /><Route path="/upload" element={<Upload />} /><Route path="/trending" element={<Trending />} /><Route path="/search" element={<Search />} /><Route path="/profile/:uid" element={<Profile />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>{!firebaseConfigured && <div className="fixed bottom-20 right-4 z-50 hidden max-w-xs rounded-xl border border-accent/30 bg-ink/95 px-4 py-3 text-xs text-accent shadow-glow sm:block">Demo shell: configure Firebase to enable accounts and cloud features.</div>}</Layout>;
}
