import { NextRequest, NextResponse } from 'next/server';
import { getCloudinaryClient } from '@/lib/cloudinary';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo no proporcionado.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Formato de imagen no soportado. Usa JPG, PNG o WebP.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Cada imagen debe pesar máximo 5 MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudinary = getCloudinaryClient();

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'talentlink/actor-portfolios',
          overwrite: false,
          transformation: [
            { width: 2400, height: 2400, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    const result = uploadResult as {
      secure_url: string;
      public_id: string;
      bytes: number;
      width?: number;
      height?: number;
      format?: string;
    };

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      width: result.width,
      height: result.height,
      format: result.format
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: 'No se pudo subir la imagen.' }, { status: 500 });
  }
}
