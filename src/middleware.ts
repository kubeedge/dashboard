import { cookies } from 'next/headers';

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const protectedPaths = new Set([
  '/',
  '/node',
  '/nodeGroup',
  '/deployment',
  '/edgeApplication',
  '/configMap',
  '/secret',
  '/deviceModel',
  '/device',
  '/ruleEndpoint',
  '/rule',
  '/service',
  '/serviceAccount',
  '/role',
  '/roleBinding',
  '/clusterRole',
  '/clusterRoleBinding',
  '/crd',
])

async function handleApiProxy(req: NextRequest) {
  try {
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value
    });
    const path = req.nextUrl.pathname.replace('/api/', '/api/v1/')
    const url = new URL(path, process.env.API_SERVER);

    const resp = await fetch(url, {
      method: req.method,
      headers,
      body: req.body,
    })

    if (req.method === 'DELETE' ||  resp.status >= 400) {
      const msg = await resp.text();
      return NextResponse.json({
        message: msg,
      }, {
        status: resp.status === 204 ? 200 : resp.status,
        headers: resp.headers,
      });
    }

    const body = await resp.json();
    return NextResponse.json(body, {
      status: resp.status,
      headers: resp.headers,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || error || 'Something went wrong',
    }, {
      status: error?.status || 500,
    });
  }
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/') || req.nextUrl.pathname.startsWith('/keink/')) {
    return handleApiProxy(req);
  }

  const user = cookies().get('dashboard_user')?.value;
  if (user === undefined && protectedPaths.has(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next();
}
