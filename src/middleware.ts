import { AxiosError } from 'axios';
import { cookies } from 'next/headers';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
    const baseUrl = process.env.API_SERVER;
    if (!baseUrl) {
      throw new Error('The API server is not configured, please check API_SERVER environment variable');
    }

    const path = req.nextUrl.pathname.replace('/api/', '/')
    const url = new URL(path, baseUrl);

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value
    });

    const resp = await fetch(url, {
      method: req.method,
      headers,
      body: req.body,
    })
    const body = await resp.json();

    return NextResponse.json(body, {
      status: resp.status,
      headers: resp.headers,
    });
  } catch (error: AxiosError | any) {
    if (error instanceof AxiosError) {
      console.error(error?.cause || error?.message || error);
    } else {
      console.error(error);
    }

    return NextResponse.json({
      message: error?.message || error || 'Something went wrong',
    }, {
      status: error?.status || 500,
    });
  }
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return handleApiProxy(req);
  }

  const user = cookies().get('dashboard_user')?.value;
  if (!user && protectedPaths.has(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next();
}
