import { WebSocketServer } from 'ws';

const PORT = 8080;

const MSG_TYPE = {
  JOIN: 'JOIN',
  MESSAGE: 'MESSAGE',
  LEAVE: 'LEAVE',
};

// Start a WebSocket server
const wsServer = new WebSocketServer({ port: PORT }, () => {
  console.log(`Server started on port ${PORT}\n`);
});

const clients = new Map();

// Lisen for incoming connections
wsServer.on('connection', (ws) => {
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    switch (data.type) {
      case MSG_TYPE.JOIN:
        clients.set(ws, data.content);
        console.log(
          `${data.content} joined the chat, total clients: ${wsServer.clients.size}\n`
        );
        break;
      case MSG_TYPE.MESSAGE:
        console.log(data.content);
        for (const client of clients.keys()) {
          // boradcast the message to all clients except the sender
          if (client !== ws) {
            client.send(`${clients.get(ws)}: ${data.content}`);
          }
        }
        break;
      case MSG_TYPE.LEAVE:
        console.log(`${clients.get(ws)} left the chat\n`);
        break;
      default:
        console.log(`Invalid message type: ${data.type}\n`);
        break;
    }
  };

  ws.onclose = () => {
    console.log(
      `${clients.get(ws)} disconnected, total clients: ${
        wsServer.clients.size
      }\n`
    );
    // remove the client from the clients map
    clients.delete(ws);
  };

  ws.onerror = (error) => {
    console.log('Error:', error);
  };
});
