import { WebSocketServer } from 'ws';

const PORT = 8080;

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
      case 'JOIN':
        clients.set(ws, data.content);
        console.log(
          `${data.content} joined the chat, total clients: ${wsServer.clients.size}\n`
        );
        break;
      case 'MESSAGE':
        console.log(data.content);
        for (const client of clients.keys()) {
          if (client !== ws) {
            client.send(`${clients.get(ws)}: ${data.content}`);
          }
        }
        break;
    }
  };

  ws.onclose = () => {
    console.log(
      `${clients.get(ws)} disconnected, total clients: ${
        wsServer.clients.size
      }\n`
    );
    clients.delete(ws);
  };

  ws.onerror = (error) => {
    console.log('Error:', error);
  };
});
