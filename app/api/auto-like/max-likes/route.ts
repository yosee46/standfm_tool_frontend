import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const maxLikes = parseInt(searchParams.get('maxLikes') || '100', 10);

  if (!userId) {
    return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 });
  }

  try {
    const updatedTool = await prisma.auto_like_tools.upsert({
      where: { user_id: userId },
      update: { max_likes: maxLikes },
      create: { user_id: userId, max_likes: maxLikes },
    });

    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error("Error setting max likes:", error);
    return NextResponse.json({ error: "最大いいね数の設定に失敗しました" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 });
  }

  try {
    const tool = await prisma.auto_like_tools.findUnique({
      where: { user_id: userId },
      select: { max_likes: true },
    });

    return NextResponse.json({ maxLikes: tool?.max_likes || 100 });
  } catch (error) {
    console.error("Error fetching max likes:", error);
    return NextResponse.json({ error: "最大いいね数の取得に失敗しました" }, { status: 500 });
  }
}