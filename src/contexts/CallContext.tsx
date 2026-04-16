/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Peer from 'peerjs';
import type { MediaConnection } from 'peerjs';
import socket from '../services/socket';

interface CallContextType {
  peerId: string | null;
  incomingCall: MediaConnection | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callPartner: (partnerPeerId: string, type: 'audio' | 'video') => void;
  answerCall: () => void;
  endCall: () => void;
  isCalling: boolean;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  
  const peerRef = useRef<Peer | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('lovechat_user_id');
    if (!userId) return;

    const peer = new Peer(userId, {
      debug: 2
    });

    peer.on('open', (id) => {
      setPeerId(id);
      socket.connect();
      socket.emit('register-peer', id);
    });

    peer.on('call', (call) => {
      setIncomingCall(call);
    });

    peerRef.current = peer;

    return () => {
      peer.destroy();
      socket.disconnect();
    };
  }, []);

  const callPartner = async (partnerPeerId: string, type: 'audio' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true
      });
      
      setLocalStream(stream);
      setIsCalling(true);

      const call = peerRef.current!.call(partnerPeerId, stream);
      currentCallRef.current = call;

      call.on('stream', (remote) => {
        setRemoteStream(remote);
      });

      call.on('close', () => {
        endCall();
      });
    } catch (err) {
      console.error('Failed to get local stream', err);
    }
  };

  const answerCall = async () => {
    if (!incomingCall) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // or check call metadata for type
        audio: true
      });

      setLocalStream(stream);
      incomingCall.answer(stream);
      setIsCalling(true);

      incomingCall.on('stream', (remote) => {
        setRemoteStream(remote);
      });

      incomingCall.on('close', () => {
        endCall();
      });
      
      setIncomingCall(null);
    } catch (err) {
      console.error('Failed to answer call', err);
    }
  };

  const endCall = () => {
    if (currentCallRef.current) currentCallRef.current.close();
    if (incomingCall) incomingCall.close();
    
    localStream?.getTracks().forEach(track => track.stop());
    
    setLocalStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setIncomingCall(null);
  };

  return (
    <CallContext.Provider value={{
      peerId,
      incomingCall,
      localStream,
      remoteStream,
      callPartner,
      answerCall,
      endCall,
      isCalling
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within CallProvider');
  return context;
};
