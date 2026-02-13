import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(session.value, process.env.JWT_SECRET as string) as {
      sub: string;
      email: string;
    };

    const { blockId } = await req.json();
    if (!blockId) {
      return NextResponse.json({ error: "Missing blockId" }, { status: 400 });
    }

    const existing = await prisma.ownership.findUnique({
      where: { blockId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not owned" }, { status: 404 });
    }

    if (existing.owner !== decoded.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.ownership.delete({
      where: { blockId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}