export async function notifyNewMessage(message: {
    chatId: number;
    id: number;
    content: string;
    createdAt: Date;
    sender: { fullName: string; avatarUrl: string | null };
    status: string;
  }) {
    await fetch('http://localhost:4000/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
  }