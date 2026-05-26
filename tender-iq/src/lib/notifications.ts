import prisma from './prisma';
import { sendEmail } from './email';

export async function createNotification({
  userId,
  title,
  message,
  type = 'INFO',
  link,
  sendEmailAlert = false
}: {
  userId: string,
  title: string,
  message: string,
  type?: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR',
  link?: string,
  sendEmailAlert?: boolean
}) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    }
  });

  if (sendEmailAlert) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `TenderIQ: ${title}`,
        body: `<p>${message}</p>${link ? `<a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${link}">View details</a>` : ''}`
      });
    }
  }

  return notification;
}
