import { env } from 'node:process';
import type { RequestHandler } from './$types';
const proxy: RequestHandler = async ({ request, params, url, fetch }) => {
  const base =
    env.API_ORIGIN ||
    (env.API_HOSTPORT ? 'http://' + env.API_HOSTPORT : 'http://localhost:5080');
  const target = new URL('/api/' + params.path, base);
  target.search = url.search;
  const headers = new Headers();
  if (env.API_PROXY_KEY) headers.set('X-Penitent-Proxy-Key', env.API_PROXY_KEY);
  for (const key of ['content-type', 'cookie', 'x-csrf-token', 'accept']) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }
  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method)
        ? undefined
        : await request.arrayBuffer(),
      redirect: 'manual',
    });
    const outgoing = new Headers({
      'content-type':
        response.headers.get('content-type') || 'application/json',
      'cache-control': 'no-store',
    });
    for (const cookie of response.headers.getSetCookie())
      outgoing.append('set-cookie', cookie);
    return new Response(response.body, {
      status: response.status,
      headers: outgoing,
    });
  } catch {
    return Response.json(
      {
        title: 'The store is temporarily unavailable. Please try again.',
        status: 503,
      },
      { status: 503 },
    );
  }
};
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;

