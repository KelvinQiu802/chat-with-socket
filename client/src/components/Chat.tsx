import { useEffect, useState } from 'react';
import { createMessage } from '../utils/message';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';

interface Props {
  userName: string;
}

function Chat({ userName }: Props) {
  const [connected, setConnected] = useState(false);
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const handleConnect = () => {
    if (ws) return;
    setWs(new WebSocket('ws://localhost:8080'));
  };

  const handleSendMsg = () => {
    if (!ws || !connected) return;
    ws.send(JSON.stringify(createMessage(msg)));
    setMsg('');
    setHistory((prev) => [...prev, `You: ${msg}`]);
  };

  const handleLeave = () => {
    if (!ws || !connected) return;
    ws.send(JSON.stringify(createMessage(userName, 'LEAVE')));
    ws.close();
    setWs(null);
    setConnected(false);
    setHistory((prev) => [...prev, 'You left the chat']);
  };

  useEffect(() => {
    handleConnect();
  }, []);

  useEffect(() => {
    if (!ws) return;
    ws.onopen = () => {
      console.log('Connected');
      setConnected(true);
      if (ws) {
        ws.send(JSON.stringify(createMessage(userName, 'JOIN')));
        setHistory((prev) => [...prev, 'You joined the chat']);
      }
    };

    ws.onmessage = (e) => {
      const msg = e.data;
      setHistory((prev) => [...prev, msg]);
    };
  }, [ws]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userName}</CardTitle>
        <CardDescription>{`Status: ${
          connected ? 'online' : 'offline'
        }`}</CardDescription>
      </CardHeader>
      <CardContent>
        {history.map((h) => (
          <p key={h}>{h}</p>
        ))}
      </CardContent>
      <CardFooter>
        <div className='flex w-full max-w-sm items-center space-x-2'>
          <Input
            type='text'
            placeholder='Message'
            className='w-60'
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            autoFocus
          />
          <Button
            type='submit'
            disabled={!connected || !ws || !msg}
            onClick={handleSendMsg}
          >
            Send
          </Button>
          <Button
            type='submit'
            variant='destructive'
            disabled={!connected}
            onClick={handleLeave}
          >
            Leave
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Chat;
