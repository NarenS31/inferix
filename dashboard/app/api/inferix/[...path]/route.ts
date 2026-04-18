import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { inferixUrl } from "@/lib/inferix";

async function proxy(request: Request, path: string[]): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const query = requestUrl.search;
  const url = inferixUrl(`/v1/${path.join("/")}${query}`);
  const method = request.method;

  const contentType = request.headers.get("content-type") ?? "application/json";
  // Forward the dashboard JWT as the Bearer token to the backend
  const dashboardToken = cookies().get("inferix_dashboard_auth")?.value ?? "";
  const headers = new Headers({ "Content-Type": contentType });
  headers.set("Authorization", `Bearer ${dashboardToken}`);

  const init: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.text();
  }

  const upstream = await fetch(url, init);
  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export async function GET(request: Request, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  return proxy(request, params.path);
}

export async function POST(request: Request, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  return proxy(request, params.path);
}

export async function PUT(request: Request, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  return proxy(request, params.path);
}

export async function DELETE(request: Request, { params }: { params: { path: string[] } }): Promise<NextResponse> {
  return proxy(request, params.path);
}
