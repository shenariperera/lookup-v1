import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true }
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    });

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Supabase password update error:', updateError);
      // Don't fail completely - database is updated
    }

    return NextResponse.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'An error occurred while changing password' },
      { status: 500 }
    );
  }
}