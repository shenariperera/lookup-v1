import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

// GET - Fetch all offers for the logged-in company
export async function GET() {
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

    // Find user's company
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { company: true },
    });

    if (!dbUser || !dbUser.company) {
      return NextResponse.json(
        { message: 'Company not found' },
        { status: 404 }
      );
    }

    // Fetch all offers for this company
    const offers = await prisma.offer.findMany({
      where: {
        companyId: dbUser.company.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(offers);

  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// POST - Create new offer
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

    // Find user's company
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { company: true },
    });

    if (!dbUser || !dbUser.company) {
      return NextResponse.json(
        { message: 'Company not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      title,
      description,
      terms,
      category,
      coverImage,
      startDate,
      endDate,
      ctaButtonText,
      ctaButtonLink,
      ctaEmail,
      originalPrice,
      discountPercent,
      finalPrice,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !coverImage || !startDate || !endDate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate CTA (at least one required)
    if (!ctaButtonLink && !ctaEmail) {
      return NextResponse.json(
        { message: 'Please provide either a CTA link or an email for inquiries' },
        { status: 400 }
      );
    }

    // Generate offer slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check for unique slug
    while (await prisma.offer.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create offer with PENDING status
    const offer = await prisma.offer.create({
      data: {
        title,
        slug,
        description,
        terms: terms || null,
        category,
        coverImage,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ctaButtonText: ctaButtonText || null,
        ctaButtonLink: ctaButtonLink || null,
        ctaEmail: ctaEmail || null,
        originalPrice: originalPrice || null,
        discountPercent: discountPercent || null,
        finalPrice: finalPrice || null,
        status: 'PENDING', // Always start as PENDING for admin approval
        featured: false,
        companyId: dbUser.company.id,
      },
    });

    return NextResponse.json(
      { 
        message: 'Offer created successfully and sent for approval',
        offer 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating offer:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'An offer with this title already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create offer' },
      { status: 500 }
    );
  }
}