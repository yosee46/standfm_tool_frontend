import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { firebaseUid } = await request.json();

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Firebase UIDが必要です' }, { status: 400 });
  }

  try {
    const user = await prisma.users.upsert({
      where: { firebase_uid: firebaseUid },
      update: {},
      create: {
        firebase_uid: firebaseUid
      },
    });

    return NextResponse.json({ userId: user.id });
  } catch (error) {
    console.error('ユーザー情報の保存中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'ユーザー情報の保存中にエラーが発生しました' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}