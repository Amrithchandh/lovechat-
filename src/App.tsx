import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import ChatRoom from './pages/ChatRoom';
import { CallProvider } from './contexts/CallContext';
import CallOverlay from './components/CallOverlay';
import { useState } from 'react';

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return localStorage.getItem('lovechat_auth') === 'true' && !!localStorage.getItem('lovechat_room');
  });
  const [roomId, setRoomId] = useState<string | null>(() => {
    return localStorage.getItem('lovechat_room');
  });

  return (
    <CallProvider>
      <Router>
        <div className="h-screen w-full flex flex-col overflow-hidden">
          <Routes>
            <Route 
              path="/" 
              element={!isAuth ? <Onboarding onAuth={(id) => {
                setRoomId(id);
                setIsAuth(true);
              }} /> : <Navigate to={`/chat/${roomId}`} />} 
            />
            <Route 
              path="/chat/:roomId" 
              element={isAuth ? <ChatRoom /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <CallOverlay />
        </div>
      </Router>
    </CallProvider>
  );
}

export default App;
