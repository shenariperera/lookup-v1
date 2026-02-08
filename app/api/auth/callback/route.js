import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      // Redirect to login page with confirmed=true
      const redirectUrl = `${isLocalEnv ? origin : `https://${forwardedHost || origin}`}/auth/login?confirmed=true`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Error case - redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=confirmation-failed`);
}