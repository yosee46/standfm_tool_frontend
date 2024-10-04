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
    const executions = await prisma.auto_like_executions.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        executed_at: 'desc'
      },
      take: 10
    });

    const formattedExecutions = executions.map(execution => ({
      startTime: execution.executed_at.toISOString(),
      likes: execution.like_count
    }));

    return NextResponse.json(formattedExecutions);
  } catch (error) {
    console.error("Error fetching auto-like executions:", error);
    return NextResponse.json({ error: "実行履歴の取得に失敗しました" }, { status: 500 });
  }
}