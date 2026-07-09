import { prisma } from '@/lib/prisma';
import { AdminHeader } from '@/components/admin/admin-header';
import { MessageList } from '@/components/admin/message-list';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  const unread = messages.filter((m) => !m.read).length;
  return (
    <div>
      <AdminHeader
        title="Messages"
        subtitle={
          unread > 0
            ? `${unread} message(s) non lu(s).`
            : 'Boîte de réception du formulaire de contact.'
        }
      />
      <MessageList messages={messages} />
    </div>
  );
}
