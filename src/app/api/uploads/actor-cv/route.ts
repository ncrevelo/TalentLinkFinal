import { NextRequest, NextResponse } from 'next/server';
import { getCloudinaryClient } from '@/lib/cloudinary';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MIN_FILE_SIZE_BYTES = 1024; // 1 KB mínimo
const ALLOWED_MIME_TYPES = new Set(['application/pdf']);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo no proporcionado.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Solo se permiten archivos PDF.' }, { status: 400 });
    }

    if (file.size < MIN_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'El archivo debe tener al menos 1 KB.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'El archivo debe pesar máximo 10 MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudinary = getCloudinaryClient();

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw', // Para PDFs y documentos
          folder: 'talentlink/actor-cvs',
          overwrite: false,
          format: 'pdf' // Forzar formato PDF
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
      format?: string;
    };

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format
    });
  } catch (error) {
    console.error('Cloudinary CV upload error:', error);
    return NextResponse.json({ error: 'No se pudo subir el CV.' }, { status: 500 });
  }
}