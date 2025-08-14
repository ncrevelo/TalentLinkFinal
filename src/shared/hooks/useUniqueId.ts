import { useId } from 'react';

/**
 * Hook personalizado para generar IDs únicos que sean consistentes
 * entre el servidor y el cliente para evitar errores de hidratación
 */
export const useUniqueId = (prefix: string = 'id'): string => {
  const id = useId();
  return `${prefix}-${id}`;
};
