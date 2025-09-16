'use client';

import { UserRole } from '../../types';
import { Button } from '../../../../components/ui/Button';

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void;
  selectedRole: UserRole | null;
}

const RoleSelection = ({ onRoleSelect, selectedRole }: RoleSelectionProps) => {
  const roles = [
    {
      id: UserRole.ACTOR,
      title: 'Soy Actor/Talento',
      description: 'Busco oportunidades de trabajo en el mundo del entretenimiento',
      icon: '🎭',
      features: [
        'Crear tu portafolio profesional',
        'Recibir ofertas de trabajo',
        'Conectar con directores de casting',
        'Mostrar tu reel y fotografías'
      ]
    },
    {
      id: UserRole.HIRER,
      title: 'Busco Talento',
      description: 'Soy director de casting, productor o empresa que contrata talentos',
      icon: '🎬',
      features: [
        'Publicar ofertas de trabajo',
        'Buscar talentos específicos',
        'Gestionar castings',
        'Conectar con profesionales'
      ]
    }
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Cómo planeas usar TalentLink?
        </h2>
        <p className="text-gray-600">
          Selecciona la opción que mejor describa tu objetivo en la plataforma
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`
              relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200
              hover:shadow-lg
              ${selectedRole === role.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onRoleSelect(role.id)}
          >
            {/* Selection indicator */}
            {selectedRole === role.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Icon */}
            <div className="text-4xl mb-4">{role.icon}</div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {role.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {role.description}
            </p>

            {/* Features */}
            <ul className="space-y-2">
              {role.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Select button */}
            <div className="mt-6">
              <Button
                variant={selectedRole === role.id ? 'primary' : 'outline'}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onRoleSelect(role.id);
                }}
              >
                {selectedRole === role.id ? 'Seleccionado' : 'Seleccionar'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          ¿No estás seguro? Puedes cambiar tu selección más adelante en la configuración de tu cuenta
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
