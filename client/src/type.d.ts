type MessageType = 'MESSAGE' | 'JOIN' | 'LEAVE';

interface Message {
  type: MessageType;
  content: string;
}
