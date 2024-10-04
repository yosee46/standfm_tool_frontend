import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const isEnabled = searchParams.get('isEnabled') === 'true';

  if (!userId) {
    return NextResponse.json({ error: "ユーザーIDが必要です" }, { status: 400 });
  }

  try {
    const updatedTool = await prisma.auto_like_tools.upsert({
      where: { user_id: userId },
      update: { is_enabled: isEnabled },
      create: { user_id: userId, is_enabled: isEnabled },
    });

    const formattedTool = {
      userId: updatedTool.user_id,
      isEnabled: updatedTool.is_enabled
    };

    return NextResponse.json(formattedTool);
  } catch (error) {
    console.error("Error toggling auto-like:", error);
    return NextResponse.json({ error: "自動いいねの切り替えに失敗しました" }, { status: 500 });
  }
}