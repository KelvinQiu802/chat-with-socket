import { useState } from 'react';
import { createMessage } from './utils/message';

let ws: WebSocket | null = null;

function App() {
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
    console.log(ws);
    if (!ws || !connected) return;
    ws.send(JSON.stringify(createMessage(msg)));
  };

  return (
    <div>
      <h5>{name}</h5>
      <div>
        <label htmlFor='userName'>User Name: </label>
        <input
          type='text'
          value={name}
          id='userName'
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <button
          onClick={handleConnect}
          disabled={connected || name.replace(' ', '') === ''}
        >
          Connect
        </button>
      </div>
      <hr />
      <div>
        <label htmlFor=''>Message: </label>
        <input
          type='text'
          value={msg}
          onChange={(e) => setMsg(e.currentTarget.value)}
        />
        <button onClick={handleSendMsg}>Send</button>
      </div>
    </div>
  );
}

export default App;
