import { useState } from 'react';
import Chat from './components/Chat';
import { Button } from './components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Input } from './components/ui/input';

function App() {
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState<string[]>([]);

  const handleCreate = () => {
    setUsers((prev) => [...prev, userName]);
    setUserName('');
  };

  return (
    <div>
      <Card className='m-10'>
        <CardHeader>
          <CardTitle>Chat Panal</CardTitle>
          <CardDescription>WebSocket Chat Playground</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex w-full max-w-sm items-center space-x-2'>
            <Input
              type='text'
              placeholder='User Name'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoFocus
            />
            <Button
              type='submit'
              onClick={handleCreate}
              disabled={userName.replace(' ', '') === ''}
            >
              Create Chat
            </Button>
          </div>
          <div className='flex flex-wrap gap-7 mt-7'>
            {users.map((u) => (
              <Chat userName={u} key={u} />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className='text-gray-500 text-sm'>@KelvinQiu802</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
