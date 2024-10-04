import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const username = searchParams.get('username');
  const password = searchParams.get('password');

  if (!id) {
    return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
  }

  try {
    const user = await prisma.users.upsert({
      where: { id: id },
      update: {
        user_name: username,
        password: password,
      },
      create: {
        id: id,
        user_name: username,
        password: password,
      },
    });

    return NextResponse.json({ message: 'ユーザー設定が正常に保存されました', user });
  } catch (error) {
    console.error('ユーザー設定の保存中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'ユーザー設定の保存中にエラーが発生しました' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}