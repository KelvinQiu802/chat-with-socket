export function createMessage(
  content: string,
  type: MessageType = 'MESSAGE'
): Message {
  return { content, type };
}
