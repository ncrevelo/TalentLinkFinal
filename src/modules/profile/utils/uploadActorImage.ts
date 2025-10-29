export interface UploadActorImageResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  size: number;
  format?: string;
}

export async function uploadActorImage(file: File): Promise<UploadActorImageResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/uploads/actor-media', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = typeof errorBody?.error === 'string' ? errorBody.error : 'No se pudo subir la imagen.';
    throw new Error(message);
  }

  const data = await response.json();
  return data as UploadActorImageResult;
}
