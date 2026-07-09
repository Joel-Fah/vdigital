'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';

export type ActionResult = { ok: boolean };

export async function setMessageReadAction(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath(adminPath('messages'));
  return { ok: true };
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath(adminPath('messages'));
  return { ok: true };
}
