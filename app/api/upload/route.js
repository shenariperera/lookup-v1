import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { generateUniqueFilename } from '@/lib/imageUpload';

// Initialize S3 client for Cloudflare R2
const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'images';

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const key = `${folder}/${filename}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await S3.send(command);

    // Return public URL
    const url = `${PUBLIC_URL}/${key}`;

    return NextResponse.json(
      { 
        url,
        filename,
        size: buffer.length,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}