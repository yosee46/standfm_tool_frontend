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
      },
    });

    const formattedSettings = settings
      ? {
          isEnabled: settings.is_enabled,
          maxLikes: settings.max_likes,
        }
      : null;

    return NextResponse.json(formattedSettings || { isEnabled: false, maxLikes: 100 });
  } catch (error) {
    console.error("Error fetching auto-like settings:", error);
    return NextResponse.json({ error: "設定の取得に失敗しました" }, { status: 500 });
  }
}