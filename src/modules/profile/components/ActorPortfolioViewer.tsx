import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { PortfolioPhoto } from './ActorPortfolioMediaSection';

export type { PortfolioPhoto };

interface ActorPortfolioViewerProps {
  photos: PortfolioPhoto[];
  reelUrl?: string;
  cvUrl?: string;
  actorName: string;
}

export const ActorPortfolioViewer: React.FC<ActorPortfolioViewerProps> = ({
  photos,
  reelUrl,
  cvUrl,
  actorName
}) => {
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    return null;
  };

  const embedUrl = reelUrl ? getYouTubeEmbedUrl(reelUrl) : null;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Portafolio de {actorName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CV */}
        {cvUrl && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">CV</h3>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ver CV (PDF)
            </a>
          </div>
        )}

        {/* Reel */}
        {embedUrl && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Video de Presentación</h3>
            <div className="aspect-video w-full max-w-2xl">
              <iframe
                src={embedUrl}
                title={`Video de presentación de ${actorName}`}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Fotos */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Galería de Fotos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={photo.url} className="relative rounded-lg border border-gray-200 overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={`Foto ${index + 1} del portafolio de ${actorName}`}
                    width={photo.width ?? 400}
                    height={photo.height ?? 400}
                    className="h-48 w-full object-cover"
                  />
                  <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200 bg-white/80 backdrop-blur">
                    {photo.width && photo.height ? `${photo.width}x${photo.height}px` : ''}
                    {photo.size ? ` · ${(photo.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje si no hay contenido */}
        {!cvUrl && !embedUrl && photos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Este actor aún no ha completado su portafolio.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};