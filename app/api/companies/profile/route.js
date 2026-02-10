import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

// Note: Make sure you have created the Prisma client at lib/prisma.js
// and the Supabase server client is at lib/supabase/server.js

// GET - Fetch company profile
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

    // Find company associated with this user
    const company = await prisma.company.findFirst({
      where: {
        user: {
          id: user.id
        }
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json(
        { message: 'Company not found' },
        { status: 404 }
      );
    }

    // Return company data with proper field names
    const profileData = {
      id: company.id,
      name: company.name,
      slug: company.slug,
      description: company.description || '',
      category: company.category || '',
      website: company.website || '',
      phone: company.phone || '',
      whatsapp: company.whatsapp || '',
      email: company.email || '',
      location: company.location || '',
      facebook: company.facebook || '',
      instagram: company.instagram || '',
      tiktok: company.tiktok || '',
      linkedin: company.linkedin || '',
      logoUrl: company.logoUrl || null,
      bannerUrl: company.bannerUrl || null,
      status: company.status,
      userName: company.user?.name || '',
      userEmail: company.user?.email || ''
    };

    console.log('Returning company profile:', { id: profileData.id, category: profileData.category });
    
    return NextResponse.json(profileData);

  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT - Update company profile
export async function PUT(request) {
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
    const {
      name,
      description,
      category,
      website,
      phone,
      whatsapp,
      email,
      location,
      facebook,
      instagram,
      tiktok,
      linkedin,
      logoUrl,
      bannerUrl,
    } = body;

    // Validate required fields
    if (!name || !description || !category || !phone || !email || !location) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find company
    const existingCompany = await prisma.company.findFirst({
      where: {
        user: {
          id: user.id
        }
      }
    });

    if (!existingCompany) {
      return NextResponse.json(
        { message: 'Company not found' },
        { status: 404 }
      );
    }

    // Update company
    const updatedCompany = await prisma.company.update({
      where: {
        id: existingCompany.id
      },
      data: {
        name,
        description,
        category,
        website: website || null,
        phone,
        whatsapp: whatsapp || null,
        email,
        location,
        facebook: facebook || null,
        instagram: instagram || null,
        tiktok: tiktok || null,
        linkedin: linkedin || null,
        logoUrl: logoUrl || null,
        bannerUrl: bannerUrl || null,
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      company: updatedCompany
    });

  } catch (error) {
    console.error('Error updating company profile:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'A company with this information already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}