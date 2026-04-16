import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  limit,
  updateDoc,
  doc,
  setDoc
} from 'firebase/firestore';
import { db, storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { encryptMessage, decryptMessage } from '../utils/encryption';

export interface Message {
  id: string;
  text?: string;
  mediaUrl?: string;
  senderId: string;
  timestamp: Date;
  status: string;
  type: string;
}

export const useChat = (roomId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [partnerStatus, setPartnerStatus] = useState<{ online: boolean; lastSeen: unknown } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId || !userId) return;

    // Register presence
    const userDoc = doc(db, `rooms/${roomId}/users`, userId);
    setDoc(userDoc, {
      lastSeen: serverTimestamp(),
      online: true
    }, { merge: true });

    // Discovery: Listen for the other user in the room
    const usersQuery = collection(db, `rooms/${roomId}/users`);
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const otherUser = snapshot.docs.find(d => d.id !== userId);
      if (otherUser) {
        setPartnerId(otherUser.id);
        setPartnerStatus(otherUser.data() as { online: boolean; lastSeen: unknown });
      }
    });

    const q = query(
      collection(db, `rooms/${roomId}/messages`),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          text: decryptMessage(data.text, roomId),
          timestamp: data.timestamp?.toDate() || new Date()
        } as Message;
      }).reverse();
      
      setMessages(msgs);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unsubUsers();
      updateDoc(userDoc, { online: false, lastSeen: serverTimestamp() }).catch(console.error);
    };
  }, [roomId, userId]);

  const sendMessage = async (text: string, senderId: string) => {
    if (!text.trim()) return;

    const encryptedText = encryptMessage(text, roomId);
    
    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      text: encryptedText,
      senderId,
      timestamp: serverTimestamp(),
      status: 'sent',
      type: 'text'
    });
  };

  const uploadMedia = async (file: File, senderId: string) => {
    const fileRef = ref(storage, `rooms/${roomId}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    
    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      mediaUrl: url,
      senderId,
      timestamp: serverTimestamp(),
      status: 'sent',
      type: file.type.startsWith('image') ? 'image' : 'video'
    });
  };

  return { messages, partnerId, partnerStatus, loading, sendMessage, uploadMedia };
};
