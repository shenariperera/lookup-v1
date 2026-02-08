import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      companyName,
      category,
      phone,
      whatsapp,
      website,
      facebook,
      instagram,
      tiktok,
      linkedin,
      location,
      description,
      logoUrl,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !companyName || !category || !phone || !location || !description || !logoUrl) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const supabase = await createClient();
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`,
        data: {
          name,
        },
      },
    });

    if (authError) {
      if (authError.message?.includes('already registered')) {
        return NextResponse.json(
          { message: 'User with this email already exists' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { message: authError.message || 'Failed to create user account' },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Check if company already exists in database
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { email },
          { user: { email } }
        ]
      }
    });

    if (existingCompany) {
      return NextResponse.json(
        { message: 'A company with this email already exists' },
        { status: 400 }
      );
    }

    // Generate company slug
    const baseSlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check for unique slug
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create company in database
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug,
        description,
        logoUrl,
        website: website || null,
        phone,
        whatsapp: whatsapp || null,
        facebook: facebook || null,
        instagram: instagram || null,
        tiktok: tiktok || null,
        linkedin: linkedin || null,
        email,
        location,
        category,
        status: 'PENDING',
        user: {
          create: {
            id: authData.user.id,
            email,
            passwordHash: await bcrypt.hash(password, 10),
            name,
            role: 'COMPANY',
          },
        },
      },
    });

    return NextResponse.json(
      { 
        message: 'Registration successful! Please check your email to confirm your account.',
        userId: authData.user.id,
        companyId: company.id,
      },
      { status: 201 }
    );

  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'A company with this name or email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}