import type { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/supabase-middleware";

function setTaskCookieIfPathStartsWithTask(
  request: NextRequest,
  response: NextResponse
) {
  const { pathname } = request.nextUrl;
  const taskPathRegex = /^\/tasks\/[a-z0-9-]+/;
  const pathnameIncludesTask = taskPathRegex.test(pathname);

  if (pathnameIncludesTask) {
    const [, , taskId] = pathname.split("/");

    response.cookies.set("taskId", taskId);
  } else {
    response.cookies.delete("taskId");
  }
}

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  setTaskCookieIfPathStartsWithTask(request, supabaseResponse);

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|.*svg|.*png|.*jpg|.*jpeg|.*gif|.*webp|_next/image|favicon.ico).*)",
  ],
};
