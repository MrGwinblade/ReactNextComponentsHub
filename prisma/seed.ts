const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Очищаем только таблицы, связанные с чатом, чтобы не затрагивать существующих пользователей
  await prisma.message.deleteMany({});
  await prisma.userChat.deleteMany({});
  await prisma.chat.deleteMany({});

  // Ищем существующих пользователей по fullName
  const user1 = await prisma.user.findFirstOrThrow({
    where: {
      fullName: 'useruser1',
    },
  });

  const user2 = await prisma.user.findFirstOrThrow({
    where: {
      fullName: 'useruser2',
    },
  });

  // Создаем чат типа DIRECT
  const chat = await prisma.chat.create({
    data: {
      type: 'DIRECT',
      createdAt: new Date(),
    },
  });

  // Связываем пользователей с чатом через UserChat
  await prisma.userChat.create({
    data: {
      userId: user1.id,
      chatId: chat.id,
      joinedAt: new Date(),
    },
  });

  await prisma.userChat.create({
    data: {
      userId: user2.id,
      chatId: chat.id,
      joinedAt: new Date(),
    },
  });

  // Создаем тестовые сообщения (все с статусом DELIVERED)
  const messages = [
    {
      chatId: chat.id,
      senderId: user1.id,
      content: 'Привет, как дела?',
      createdAt: new Date('2025-02-25T10:00:00Z'),
      status: 'DELIVERED',
    },
    {
      chatId: chat.id,
      senderId: user2.id,
      content: 'Привет! Всё отлично, а у тебя?',
      createdAt: new Date('2025-02-25T10:01:00Z'),
      status: 'DELIVERED',
    },
    {
      chatId: chat.id,
      senderId: user1.id,
      content: 'Тоже хорошо, что делаешь?',
      createdAt: new Date('2025-02-25T10:02:00Z'),
      status: 'DELIVERED',
    },
    {
      chatId: chat.id,
      senderId: user2.id,
      content: 'Работаю над проектом, а ты?',
      createdAt: new Date('2025-02-25T10:03:00Z'),
      status: 'DELIVERED',
    },
    {
      chatId: chat.id,
      senderId: user1.id,
      content: 'Сижу, пишу код для чата :)',
      createdAt: new Date('2025-02-25T10:04:00Z'),
      status: 'DELIVERED',
    },
  ];

  for (const message of messages) {
    await prisma.message.create({
      data: message,
    });
  }

  console.log('Чат и сообщения успешно добавлены в базу данных!');
}

main()
  .catch((e) => {
    console.error('Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });