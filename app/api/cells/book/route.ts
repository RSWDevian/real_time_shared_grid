//? The server api for booking the slots
import { NextResponse } from "next/server"; // Importing NextResponse for handling API responses
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for handling JWT authentication
import { cookies } from "next/headers"; // Importing cookies to access cookies in the request
import { prisma } from "../../../lib/db"; // Importing the Prisma client for database interactions

export async function POST(req: Request) {
  try {
    // Extracting the session cookie to authenticate the user
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // handling the authentication error
    }

    // Verifying the JWT token to get the user's email
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