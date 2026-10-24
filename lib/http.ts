import { NextResponse } from "next/server";
export function apiError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  console.error(error);
  return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
}
