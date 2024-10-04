import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 });
  }

  try {
    const settings = await prisma.auto_like_tools.findUnique({
      where: { user_id: userId },
      select: {
        is_enabled: true,
        max_likes: true,
        keywords: true,
      },
    });

    const formattedSettings = settings
      ? {
          isEnabled: settings.is_enabled,
          maxLikes: settings.max_likes,
          keywords: settings.keywords,
        }
      : null;

    return NextResponse.json(formattedSettings || { isEnabled: false, maxLikes: 100 });
  } catch (error) {
    console.error("Error fetching auto-like settings:", error);
    return NextResponse.json({ error: "設定の取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const maxLikes = parseInt(searchParams.get('maxLikes') || '100', 10);
  const keywords = searchParams.get('keywords') || '';

  if (!userId) {
    return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 });
  }

  try {
    const updatedTool = await prisma.auto_like_tools.upsert({
      where: { user_id: userId },
      update: { max_likes: maxLikes, keywords: keywords },
      create: { user_id: userId, max_likes: maxLikes, keywords: keywords },
    });

    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error("Error saving auto-like settings:", error);
    return NextResponse.json({ error: "設定の保存に失敗しました" }, { status: 500 });
  }
}