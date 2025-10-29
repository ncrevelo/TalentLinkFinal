import React, { useState } from 'react';
import { Alert, Button } from '@/components/ui';
import { uploadActorCv, UploadActorCvResult } from '../utils/uploadActorCv';

interface ActorCvUploadSectionProps {
  cvUrl: string;
  onCvChange: (url: string) => void;
  errors?: {
    resume?: string;
  };
}

const MAX_FILE_SIZE_MB = 10;
const MIN_FILE_SIZE_KB = 1;

export const ActorCvUploadSection: React.FC<ActorCvUploadSectionProps> = ({
  cvUrl,
  onCvChange,
  errors
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setUploadError(`El archivo excede ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    const sizeKB = file.size / 1024;
    if (sizeKB < MIN_FILE_SIZE_KB) {
      setUploadError(`El archivo debe tener al menos ${MIN_FILE_SIZE_KB} KB.`);
      return;
    }

    try {
      setUploading(true);
      const result: UploadActorCvResult = await uploadActorCv(file);
      onCvChange(result.url);
    } catch (error) {
      console.error('Upload error', error);
      setUploadError(error instanceof Error ? error.message : 'No se pudo subir el CV.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveCv = () => {
    onCvChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        CV (PDF)
      </label>
      <p className="text-xs text-gray-500">
        Sube tu CV en formato PDF. Tamaño mínimo: {MIN_FILE_SIZE_KB} KB, máximo: {MAX_FILE_SIZE_MB} MB.
      </p>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileSelected}
            disabled={uploading}
          />
          {uploading ? 'Subiendo...' : cvUrl ? 'Cambiar CV' : 'Subir CV'}
        </label>
        {cvUrl && (
          <Button size="sm" variant="ghost" onClick={handleRemoveCv}>
            Quitar CV
          </Button>
        )}
      </div>
      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}
      {errors?.resume && (
        <p className="text-sm text-red-600">{errors.resume}</p>
      )}
      {cvUrl && (
        <div className="mt-2">
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 text-sm underline"
          >
            Ver CV actual
          </a>
        </div>
      )}
    </div>
  );
};