export interface UploadActorCvResult {
  url: string;
  publicId: string;
  size: number;
  format?: string;
}

export const uploadActorCv = async (file: File): Promise<UploadActorCvResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/uploads/actor-cv', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al subir el CV');
  }

  const data = await response.json();
  return data;
};