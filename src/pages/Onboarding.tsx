import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Lock, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  User, 
  Phone as PhoneIcon,
  Hash,
  LogIn,
  PlusCircle,
  XCircle
} from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import CryptoJS from 'crypto-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AnimatedFlower from '../components/AnimatedFlower';
import WalkingMonkey from '../components/WalkingMonkey';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OnboardingProps {
  onAuth: (roomId: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onAuth }) => {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [userAlias, setUserAlias] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedRoom = localStorage.getItem('lovechat_room');
    const authStatus = localStorage.getItem('lovechat_auth') === 'true';
    if (savedRoom && authStatus) {
      onAuth(savedRoom);
      return;
    }

    setUserAlias(localStorage.getItem('lovechat_alias') || '');
    setContactInfo(localStorage.getItem('lovechat_contact') || '');
    if (!savedRoom) {
      setRoomId('love-' + Math.random().toString(36).substring(2, 7));
    } else {
      setRoomId(savedRoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `Join my private LoveChat! 💕\nRoom ID: ${roomId}\nPassword: [Private]`;
    if (navigator.share) {
      navigator.share({ title: 'LoveChat Invite', text }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!db) throw new Error("Firebase not initialized.");

      const passwordHash = CryptoJS.SHA256(password).toString();
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);

      const userId = localStorage.getItem('lovechat_user_id') || 'u-' + Math.random().toString(36).substring(2, 9);
      
      const userData = {
        userId,
        alias: userAlias,
        contact: contactInfo,
        joinedAt: new Date().toISOString(),
        online: true
      };

      if (isCreateMode) {
        if (roomSnap.exists()) {
          throw new Error('This Room ID already exists. Try joining or use a different ID.');
        }
        await setDoc(roomRef, {
          passwordHash,
          createdAt: new Date().toISOString(),
          users: [userData]
        });
      } else {
        if (!roomSnap.exists()) {
          throw new Error('This Room ID does not exist.');
        }
        const data = roomSnap.data();
        if (data.passwordHash !== passwordHash) {
          throw new Error('Incorrect password.');
        }
        const existingUsers = data.users || [];
        if (existingUsers.length >= 2 && !existingUsers.find((u: Record<string, unknown>) => u.userId === userId)) {
          throw new Error('Room is full (max 2 users).');
        }
        await updateDoc(roomRef, { users: arrayUnion(userData) });
      }

      localStorage.setItem('lovechat_user_id', userId);
      localStorage.setItem('lovechat_alias', userAlias);
      localStorage.setItem('lovechat_contact', contactInfo);
      localStorage.setItem('lovechat_room', roomId);
      localStorage.setItem('lovechat_auth', 'true');
      
      onAuth(roomId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#fff9fb] dark:bg-slate-950">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.4, 0] }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 10 }}
            className="absolute text-love-400"
          >
            <Heart size={20 + Math.random() * 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <WalkingMonkey />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <AnimatedFlower />
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-love-600 via-rose-500 to-soul-500 bg-clip-text text-transparent mb-2 tracking-tighter">
            LoveChat
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Our Secret World</p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-white/5">
          <div className="flex p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl mb-10 w-fit mx-auto border border-white/50">
            <button
              onClick={() => setIsCreateMode(false)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                !isCreateMode ? "bg-white dark:bg-slate-700 text-love-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LogIn size={16} />
              Join Room
            </button>
            <button
              onClick={() => setIsCreateMode(true)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                isCreateMode ? "bg-white dark:bg-slate-700 text-love-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <PlusCircle size={16} />
              Create New
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">My Alias Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text" required value={userAlias} onChange={(e) => setUserAlias(e.target.value)}
                    placeholder="e.g. My Love"
                    className="w-full pl-12 pr-6 py-4 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 focus:border-love-300 focus:ring-4 focus:ring-love-50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone/Email</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text" required value={contactInfo} onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Contact Info"
                    className="w-full pl-12 pr-6 py-4 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 focus:border-soul-300 focus:ring-4 focus:ring-soul-50 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Room ID</label>
              <div className="relative">
                <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text" required value={roomId} onChange={(e) => setRoomId(e.target.value)}
                  placeholder="love-room"
                  className="w-full pl-12 pr-28 py-5 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 focus:border-love-300 focus:ring-4 focus:ring-love-50 outline-none transition-all font-mono text-base"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <button type="button" onClick={handleCopy} className="p-2.5 rounded-2xl hover:bg-love-50 text-love-400">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <button type="button" onClick={handleShare} className="p-2.5 rounded-2xl hover:bg-soul-50 text-soul-400">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secret Room Password"
                  className="w-full pl-12 pr-6 py-5 rounded-[2.5rem] bg-white/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 focus:border-love-300 focus:ring-4 focus:ring-love-50 outline-none transition-all text-base"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="bg-rose-50 text-rose-500 p-4 rounded-3xl text-[11px] font-bold border border-rose-100 flex items-center gap-3"
                >
                  <XCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-love-600 to-rose-400 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-love-200 hover:shadow-love-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : (
                <>
                  <span className="text-base uppercase tracking-widest">{isCreateMode ? 'Create Room' : 'Unlock Room'}</span>
                  <ArrowRight size={22} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
