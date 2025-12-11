import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // Ignorar requisições de arquivos estáticos e hot reload
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Pegar token do cookie
  const token = request.cookies.get('sb-access-token')?.value

  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token)
    
    if (user && pathname === '/auth') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (!user && pathname !== '/auth') {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  } else if (pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/auth'],
}
