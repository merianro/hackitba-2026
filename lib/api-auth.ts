import { NextRequest, NextResponse } from "next/server";

/**
 * Validates the x-api-key header against the INTERNAL_API_KEY env var.
 * Returns null if valid, or a 401 NextResponse if invalid.
 */
export function validateApiKey(req: NextRequest): NextResponse | null {
  const key = req.headers.get("x-api-key");
  const expected = process.env.INTERNAL_API_KEY;

  if (!expected) {
    return NextResponse.json(
      { error: "Server misconfigured: INTERNAL_API_KEY not set" },
      { status: 500 }
    );
  }

  if (!key || key !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
