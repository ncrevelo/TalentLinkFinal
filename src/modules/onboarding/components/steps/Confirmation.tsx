'use client';

import { UserRole } from '../../types';
import { Button } from '../../../../components/ui/Button';

interface ConfirmationProps {
  role: UserRole | null;
  onComplete: () => void;
}

const Confirmation = ({ role, onComplete }: ConfirmationProps) => {
  const roleInfo = {
    [UserRole.ACTOR]: {
      title: 'Actor/Talento',
      icon: '🎭',
      description: 'Tu perfil de actor ha sido creado exitosamente',
      benefits: [
        'Recibe ofertas de trabajo directamente',
        'Conecta con directores de casting',
        'Muestra tu portafolio profesional',
        'Gestiona tu disponibilidad',
        'Construye tu red profesional'
      ],
      nextSteps: [
        'Completa tu portafolio con fotos y videos',
        'Configura tus preferencias de notificación',
        'Explora las ofertas de trabajo disponibles',
        'Conecta con otros profesionales del sector'
      ]
    },
    [UserRole.HIRER]: {
      title: 'Contratante',
      icon: '🎬',
      description: 'Tu perfil de contratante ha sido creado exitosamente',
      benefits: [
        'Publica ofertas de trabajo',
        'Busca talentos específicos',
        'Gestiona procesos de casting',
        'Conecta con profesionales verificados',
        'Accede a herramientas de gestión'
      ],
      nextSteps: [
        'Publica tu primera oferta de trabajo',
        'Explora la base de datos de talentos',
        'Configura tus filtros de búsqueda',
        'Invita a tu equipo a la plataforma'
      ]
    },
    [UserRole.ADMIN]: {
      title: 'Administrador',
      icon: '⚙️',
      description: 'Tu perfil de administrador ha sido configurado',
      benefits: [],
      nextSteps: []
    }
  };

  const currentRoleInfo = role ? roleInfo[role] : null;

  return (
    <div className="text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido a TalentLink!
        </h2>
        <p className="text-xl text-gray-600">
          {currentRoleInfo?.description}
        </p>
      </div>

      {/* Role Badge */}
      {currentRoleInfo && (
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          <span className="text-2xl">{currentRoleInfo.icon}</span>
          <span className="font-semibold">{currentRoleInfo.title}</span>
        </div>
      )}

      {/* Benefits Section */}
      {currentRoleInfo && currentRoleInfo.benefits.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ¿Qué puedes hacer ahora?
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {currentRoleInfo.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {currentRoleInfo && currentRoleInfo.nextSteps.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos pasos recomendados
          </h3>
          <div className="space-y-3">
            {currentRoleInfo.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-left">
            <p className="text-sm font-medium text-amber-800">Consejo</p>
            <p className="text-sm text-amber-700">
              Mantén tu perfil actualizado y sube contenido de calidad para destacar en la plataforma.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <Button
          onClick={onComplete}
          size="lg"
          className="px-8 py-3"
        >
          Ir al Dashboard
        </Button>
      </div>

      {/* Help Link */}
      <div className="text-sm text-gray-500">
        ¿Necesitas ayuda para empezar?{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Consulta nuestra guía de inicio
        </a>
      </div>
    </div>
  );
};

export default Confirmation;
