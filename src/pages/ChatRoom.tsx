import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useChat } from '../hooks/useChat';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  Mic,
  Camera,
  Search,
  ChevronLeft,
  Heart
} from 'lucide-react';
import { useCall } from '../contexts/CallContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const userId = localStorage.getItem('lovechat_user_id') || 'me';
  const { messages, partnerId, partnerStatus, sendMessage, uploadMedia, loading } = useChat(roomId || '', userId);
  const { callPartner } = useCall();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !roomId) return;
    sendMessage(inputText, userId);
    setInputText('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && roomId) {
      await uploadMedia(file, userId);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full bg-white/30 backdrop-blur-xl overflow-hidden border-t border-white/20">
      
      {/* Sidebar - Desktop Only or Overlay */}
      <div className="hidden md:flex w-80 border-r border-white/20 flex-col bg-white/30 backdrop-blur-md">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">LoveChat</h2>
            <div className="p-2 rounded-xl bg-love-100 text-love-600">
              <Heart className="w-5 h-5 fill-love-500" />
            </div>
          </div>
          <div className="bg-white/40 rounded-2xl p-4 border border-white/60">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">My Profile</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-love-400 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
                {localStorage.getItem('lovechat_alias')?.[0] || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                  {localStorage.getItem('lovechat_alias') || 'Guest'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {localStorage.getItem('lovechat_contact') || 'No contact info'}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/40">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secret Room ID</p>
              </div>
              <p className="text-[10px] font-mono text-love-600 bg-love-50/50 p-2 rounded-lg break-all">
                {roomId}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border border-white/50 outline-none text-sm focus:ring-1 focus:ring-love-400 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex items-center gap-4 bg-white/40 border-y border-white/20 cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-love-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                P
              </div>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800",
                partnerStatus?.online ? "bg-green-500" : "bg-slate-300"
              )} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-white">My Partner</h3>
              <p className={cn(
                "text-xs font-medium",
                partnerStatus?.online ? "text-green-600" : "text-slate-400"
              )}>
                {partnerStatus?.online ? "Online" : "Away"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white/20 relative">
        
        {/* Chat Header */}
        <div className="p-4 md:p-6 border-b border-white/20 flex items-center justify-between bg-white/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100">
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-love-400 to-rose-400 flex items-center justify-center text-white font-bold shadow-md">
                P
              </div>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white dark:border-slate-800",
                partnerStatus?.online ? "bg-green-500 animate-pulse" : "bg-slate-300"
              )} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">Partner</h3>
              <p className={cn(
                "text-[10px] md:text-xs font-medium",
                partnerStatus?.online ? "text-green-600 animate-pulse" : "text-slate-400"
              )}>
                {partnerStatus?.online ? "Active Now" : "Currently Away"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-3">
            <button 
              onClick={() => partnerId && callPartner(partnerId, 'audio')}
              className="p-2 md:p-3 rounded-2xl hover:bg-white/50 text-slate-600 transition-all"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button 
              onClick={() => partnerId && callPartner(partnerId, 'video')}
              className="p-2 md:p-3 rounded-2xl hover:bg-white/50 text-slate-600 transition-all"
            >
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 md:p-3 rounded-2xl hover:bg-white/50 text-slate-600 transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
        >
          {loading && (
            <div className="flex items-center justify-center h-20">
              <div className="w-8 h-8 border-4 border-love-200 border-t-love-500 rounded-full animate-spin" />
            </div>
          )}
          
          <div className="flex justify-center my-4">
            <span className="px-4 py-1 rounded-full bg-white/50 backdrop-blur-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/50">
              Secret Conversation
            </span>
          </div>

          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%] md:max-w-[70%]",
                msg.senderId === userId ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={msg.senderId === userId ? "bubble-me" : "bubble-partner"}>
                {msg.type === 'image' ? (
                  <img src={msg.mediaUrl} alt="shared" className="rounded-xl max-w-full h-auto cursor-pointer" onClick={() => window.open(msg.mediaUrl)} />
                ) : msg.type === 'video' ? (
                  <video src={msg.mediaUrl} controls className="rounded-xl max-w-full" />
                ) : (
                  msg.text
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 px-1">
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.senderId === userId && (
                  <div className="flex -space-x-1">
                    <span className="text-love-400 text-[10px]">✓</span>
                    <span className="text-love-400 text-[10px]">✓</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 md:p-6 bg-transparent">
          <form 
            onSubmit={handleSend}
            className="flex items-end gap-2 md:gap-4 max-w-4xl mx-auto w-full"
          >
            <div className="flex-1 flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-2 pl-4 md:pl-6 shadow-xl shadow-love-100/20">
              <button type="button" className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <Smile className="w-6 h-6" />
              </button>
              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-transparent border-none outline-none py-2 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex items-center gap-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*,video/*"
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-slate-100 text-slate-400 md:block hidden">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              className={cn(
                "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                inputText.trim() 
                  ? "bg-love-500 text-white shadow-love-200 rotate-0" 
                  : "bg-white/80 text-slate-400 shadow-slate-200 -rotate-12"
              )}
            >
              {inputText.trim() ? <Send className="w-6 h-6 ml-1" /> : <Mic className="w-6 h-6" />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatRoom;
