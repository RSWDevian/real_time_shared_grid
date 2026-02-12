import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(session.value, process.env.JWT_SECRET as string) as {
      sub: string;
      email: string;
    };

    return NextResponse.json({
      user: {
        id: decoded.sub,
        email: decoded.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}