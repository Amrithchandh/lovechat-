import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, Mic, Heart } from 'lucide-react';
import { useCall } from '../contexts/CallContext';

const CallOverlay: React.FC = () => {
  const { isCalling, incomingCall, localStream, remoteStream, answerCall, endCall } = useCall();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!isCalling && !incomingCall) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-white">
      
      {/* Incoming Call Screen */}
      <AnimatePresence>
        {incomingCall && !isCalling && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-32 h-32 rounded-full bg-love-500 animate-pulse flex items-center justify-center mb-4 shadow-2xl shadow-love-500/50">
              <Phone className="w-12 h-12 text-white animate-bounce" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Incoming Call</h2>
              <p className="text-slate-400">Your partner is calling...</p>
            </div>
            
            <div className="flex gap-12">
              <button 
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
              <button 
                onClick={answerCall}
                className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Phone className="w-8 h-8" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Call UI */}
      {isCalling && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {/* Remote Video (Main) */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {remoteStream ? (
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-love-400 animate-pulse" />
                </div>
                <p className="text-slate-400 font-medium">Connecting...</p>
              </div>
            )}
          </div>

          {/* Local Video (PiP) */}
          <div className="absolute top-8 right-8 w-32 h-44 md:w-48 md:h-64 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-800">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-12 left-0 right-0 p-4 flex justify-center gap-6">
            <button className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all">
              <Mic className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all">
              <Video className="w-6 h-6" />
            </button>
            <button 
              onClick={endCall}
              className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center hover:bg-rose-600 shadow-xl shadow-rose-500/30 transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CallOverlay;
