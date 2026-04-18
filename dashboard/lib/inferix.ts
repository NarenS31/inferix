const INFERIX_BASE = process.env.INFERIX_BASE_URL ?? "http://localhost:3000";
const INFERIX_API_KEY = process.env.INFERIX_API_KEY ?? process.env.INFERIX_MASTER_KEY ?? "inferix-...";

export function inferixUrl(path: string): string {
  return `${INFERIX_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function inferixHeaders(additional?: HeadersInit): Headers {
  const headers = new Headers(additional);
  headers.set("Authorization", `Bearer ${INFERIX_API_KEY}`);
  return headers;
}
