import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      return NextResponse.json(
        { message: 'Failed to sign out' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Signed out successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { message: 'An error occurred during sign out' },
      { status: 500 }
    );
  }
}