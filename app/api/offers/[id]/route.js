import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

// DELETE - Delete an offer
export async function DELETE(request, { params }) {
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

    // AWAIT params in Next.js 15+
    const { id: offerId } = await params;

    // Find the offer and verify ownership
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return NextResponse.json(
        { message: 'Offer not found' },
        { status: 404 }
      );
    }

    if (offer.companyId !== dbUser.company.id) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this offer' },
        { status: 403 }
      );
    }

    // Delete the offer
    await prisma.offer.delete({
      where: { id: offerId },
    });

    return NextResponse.json(
      { message: 'Offer deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json(
      { message: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}

// GET - Get single offer details (for edit page)
export async function GET(request, { params }) {
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

    // AWAIT params in Next.js 15+
    const { id: offerId } = await params;

    // Find the offer and verify ownership
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return NextResponse.json(
        { message: 'Offer not found' },
        { status: 404 }
      );
    }

    if (offer.companyId !== dbUser.company.id) {
      return NextResponse.json(
        { message: 'You do not have permission to view this offer' },
        { status: 403 }
      );
    }

    return NextResponse.json(offer);

  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      { message: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

// PUT - Update an offer
export async function PUT(request, { params }) {
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

    // AWAIT params in Next.js 15+
    const { id: offerId } = await params;

    // Find the offer and verify ownership
    const existingOffer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!existingOffer) {
      return NextResponse.json(
        { message: 'Offer not found' },
        { status: 404 }
      );
    }

    if (existingOffer.companyId !== dbUser.company.id) {
      return NextResponse.json(
        { message: 'You do not have permission to update this offer' },
        { status: 403 }
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

    // Update offer
    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        title,
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
      },
    });

    return NextResponse.json(
      { 
        message: 'Offer updated successfully',
        offer: updatedOffer 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating offer:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'An offer with this title already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to update offer' },
      { status: 500 }
    );
  }
}