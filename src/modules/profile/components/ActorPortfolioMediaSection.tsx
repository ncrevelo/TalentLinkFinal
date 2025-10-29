import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Alert, Button, Input } from '@/components/ui';
import { uploadActorImage, UploadActorImageResult } from '../utils/uploadActorImage';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 5;
const MIN_DIMENSION_PX = 400;

export interface PortfolioPhoto {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
}

interface ActorPortfolioMediaSectionProps {
  photos: PortfolioPhoto[];
  onPhotosChange: (photos: PortfolioPhoto[]) => void;
  youtubeUrl: string;
  onYoutubeUrlChange: (value: string) => void;
  errors?: {
    photos?: string;
    reel?: string;
  };
}

const isValidYouTubeUrl = (url: string) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[^\s]+$/i;
  return pattern.test(url.trim());
};

const getFileSizeMB = (file: File) => Number((file.size / (1024 * 1024)).toFixed(2));

export const ActorPortfolioMediaSection: React.FC<ActorPortfolioMediaSectionProps> = ({
  photos,
  onPhotosChange,
  youtubeUrl,
  onYoutubeUrlChange,
  errors
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const remainingSlots = MAX_IMAGES - photos.length;

  const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    setUploadError(null);

    const filesArray = Array.from(files);
    if (filesArray.length > remainingSlots) {
      setUploadError(`Solo puedes agregar ${remainingSlots} imagen${remainingSlots === 1 ? '': 'es'} adicionales.`);
      return;
    }

    try {
      setUploading(true);

      const validatedFiles = await Promise.all(filesArray.map(validateImage));

      const uploads = await Promise.all(validatedFiles.map(file => uploadActorImage(file)));

      const nextPhotos: PortfolioPhoto[] = [
        ...photos,
        ...uploads.map(mapUploadResult)
      ];

      onPhotosChange(nextPhotos.slice(0, MAX_IMAGES));
    } catch (error) {
      console.error('Upload error', error);
      setUploadError(error instanceof Error ? error.message : 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const validateImage = async (file: File): Promise<File> => {
    const sizeMB = getFileSizeMB(file);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`"${file.name}" excede ${MAX_FILE_SIZE_MB} MB.`);
    }

    const objectUrl = URL.createObjectURL(file);
    try {
      const dimensions = await getImageDimensions(objectUrl);
      if (dimensions.width < MIN_DIMENSION_PX || dimensions.height < MIN_DIMENSION_PX) {
        throw new Error(`"${file.name}" debe tener mínimo ${MIN_DIMENSION_PX}px por lado.`);
      }
      return file;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const getImageDimensions = (src: string) => new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('No fue posible validar la imagen.'));
    img.src = src;
  });

  const mapUploadResult = (result: UploadActorImageResult): PortfolioPhoto => ({
    url: result.url,
    publicId: result.publicId,
    width: result.width,
    height: result.height,
    size: result.size,
    format: result.format
  });

  const handleRemovePhoto = (url: string) => {
    onPhotosChange(photos.filter(photo => photo.url !== url));
  };

  const youtubeWarning = useMemo(() => {
    if (!youtubeUrl) {
      return null;
    }
    if (!isValidYouTubeUrl(youtubeUrl)) {
      return 'Verifica que sea un enlace válido de YouTube.';
    }
    return null;
  }, [youtubeUrl]);

  return (
    <div className="space-y-4">
      {photos.length === 0 && (
        <Alert type="info">
          Aún no has agregado fotos. Sube hasta cinco imágenes profesionales para destacar y aumentar tus oportunidades de contratación.
        </Alert>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Galería (hasta {MAX_IMAGES} imágenes)
        </label>
        <p className="text-xs text-gray-500">
          Formatos permitidos: JPG, PNG o WebP. Cada imagen debe pesar máximo {MAX_FILE_SIZE_MB} MB y medir al menos {MIN_DIMENSION_PX}px por lado.
        </p>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
              disabled={uploading || remainingSlots <= 0}
            />
            {uploading ? 'Subiendo...' : remainingSlots > 0 ? 'Agregar imágenes' : 'Límite alcanzado'}
          </label>
          {photos.length > 0 && (
            <span className="text-xs text-gray-500">{photos.length}/{MAX_IMAGES} imágenes</span>
          )}
        </div>
        {uploadError && (
          <p className="text-sm text-red-600">{uploadError}</p>
        )}
        {errors?.photos && (
          <p className="text-sm text-red-600">{errors.photos}</p>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.url} className="relative rounded-lg border border-gray-200 overflow-hidden">
              <Image
                src={photo.url}
                alt="Foto del portafolio"
                width={photo.width ?? 400}
                height={photo.height ?? 400}
                className="h-48 w-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleRemovePhoto(photo.url)}>
                  Quitar
                </Button>
              </div>
              <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200 bg-white/80 backdrop-blur">
                {photo.width && photo.height ? `${photo.width}x${photo.height}px · ` : ''}
                {photo.size ? `${(photo.size / (1024 * 1024)).toFixed(2)} MB` : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Input
          label="Video de presentación (YouTube)"
          value={youtubeUrl}
          onChange={event => onYoutubeUrlChange(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          error={errors?.reel}
        />
        {youtubeWarning && (
          <p className="text-xs text-yellow-600">{youtubeWarning}</p>
        )}
      </div>
    </div>
  );
};
