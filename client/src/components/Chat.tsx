import { useState } from 'react';
import { createMessage } from '../utils/message';

let ws: WebSocket | null = null;

function Chat() {
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleConnect = () => {
    if (ws) return;
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected');
      setConnected(true);
      if (ws) {
        ws.send(JSON.stringify(createMessage(name, 'JOIN')));
      }
    };

    ws.onmessage = (e) => {
      const msg = e.data;
      console.log(msg);
    };
  };

  const handleSendMsg = () => {
    if (!ws || !connected) return;
    ws.send(JSON.stringify(createMessage(msg)));
  };

  const handleLeave = () => {
    if (!ws || !connected) return;
    ws.send(JSON.stringify(createMessage(name, 'LEAVE')));
    ws.close();
    ws = null;
    setConnected(false);
  };

  return <div>Chat</div>;
}

export default Chat;
