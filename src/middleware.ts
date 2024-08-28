import Axios from 'axios'
import { cookies } from 'next/headers';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const request = Axios.create({
  baseURL: process.env.API_SERVER,
});

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
    const path = req.nextUrl.pathname.replace('/api/', '/')

    const response = await request(path, {
      method: req.method,
      headers,
      data: req.body,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(error?.response?.data || error, {
      status: error?.response?.status || 500,
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
