import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { auth, db, firebaseConfigured } from '../firebase';

export default function Auth({ signup = false }) {
  const [isSignup, setIsSignup] = useState(signup);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const submit = async e => {
    e.preventDefault(); setError('');
    if (!firebaseConfigured) { setError('Connect Firebase first. Copy .env.example to .env.local and add your project settings.'); return; }
    const data = new FormData(e.currentTarget); const email = data.get('email').trim(); const password = data.get('password');
    setLoading(true);
    try {
      if (isSignup) {
        const name = data.get('name').trim(); const credential = await createUserWithEmailAndPassword(auth, email, password); await updateProfile(credential.user, { displayName: name });
        await setDoc(doc(db, 'users', credential.user.uid), { name, email, photoURL: '', bio: '', followers: [], following: [], createdAt: serverTimestamp() });
      } else await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) { setError(err.code?.replace('auth/', '').replaceAll('-', ' ') || 'Something went wrong. Please try again.'); } finally { setLoading(false); }
  };
  return <div className="mx-auto grid min-h-[72vh] max-w-4xl overflow-hidden rounded-[30px] border border-white/[.08] bg-panel md:grid-cols-[.9fr_1.1fr]"><div className="relative hidden flex-col justify-between overflow-hidden bg-accent p-9 text-ink md:flex"><div className="absolute -right-20 top-20 h-72 w-72 rounded-full border-[1px] border-ink/10"/><div className="absolute -right-10 top-32 h-52 w-52 rounded-full border-[1px] border-ink/10"/><Link to="/" className="font-display text-2xl font-bold">CHASKA.</Link><div className="relative"><Sparkles size={24}/><h1 className="mt-5 font-display text-4xl font-bold leading-[1.1]">The world<br/>looks better<br/>in motion.</h1><p className="mt-4 max-w-xs text-sm leading-6 text-ink/70">Find your people. Share your point of view. Make a little noise.</p></div><p className="text-xs font-semibold text-ink/50">A place for the moments that move you.</p></div><div className="flex flex-col justify-center px-6 py-10 sm:px-12"><Link to="/" className="mb-8 font-display text-xl font-bold md:hidden">CHASKA<span className="text-accent">.</span></Link><p className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-accent">{isSignup ? 'Start your channel' : 'Welcome back'}</p><h2 className="font-display text-3xl font-bold">{isSignup ? 'Join the good stuff.' : 'Good to see you.'}</h2><p className="mt-2 text-sm text-zinc-500">{isSignup ? 'Create your account and start sharing.' : 'Log in to pick up where you left off.'}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">{isSignup && <label className="block text-xs font-semibold text-zinc-400">Your name<input required minLength="2" maxLength="40" name="name" placeholder="What should we call you?" className="form-input mt-2"/></label>}<label className="block text-xs font-semibold text-zinc-400">Email<input required type="email" name="email" placeholder="you@example.com" className="form-input mt-2"/></label><label className="block text-xs font-semibold text-zinc-400">Password<div className="relative mt-2"><input required minLength={isSignup ? 6 : undefined} type={showPassword ? 'text' : 'password'} name="password" placeholder={isSignup ? 'At least 6 characters' : 'Your password'} className="form-input pr-12"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>{error && <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">{error}</p>}<button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-bold text-ink transition hover:bg-white disabled:opacity-60">{loading ? 'One moment…' : isSignup ? 'Create account' : 'Log in'} <ArrowRight size={16}/></button></form>
      <p className="mt-6 text-center text-xs text-zinc-500">{isSignup ? 'Already have a channel?' : 'New around here?'} <button onClick={() => { setIsSignup(!isSignup); setError(''); }} className="font-semibold text-accent hover:underline">{isSignup ? 'Log in' : 'Create an account'}</button></p>
    </div></div>;
}
