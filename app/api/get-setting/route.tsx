import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'IDが指定されていません' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { userName: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('ユーザー情報の取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'ユーザー情報の取得中にエラーが発生しました' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}