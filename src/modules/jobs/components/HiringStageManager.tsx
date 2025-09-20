'use client';

import React, { useState } from 'react';
import { Job, HiringStage, HIRING_STAGES } from '../types';
import { useHiringStage } from '../hooks/useJobs';
import { Button, Card, CardContent, Alert, Modal, ModalBody, ModalFooter } from '../../../components/ui';

interface HiringStageManagerProps {
  job: Job;
  onStageChanged?: (job: Job) => void;
}

export const HiringStageManager: React.FC<HiringStageManagerProps> = ({
  job,
  onStageChanged
}) => {
  const { advanceStage, advancing, error, success, reset } = useHiringStage();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<HiringStage | null>(null);
  const [notes, setNotes] = useState('');

  // Ensure currentStage exists with fallback
  const currentStage = job.progress?.currentStage || HiringStage.RECEIVING_APPLICATIONS;
  const currentStageInfo = HIRING_STAGES[currentStage] || HIRING_STAGES[HiringStage.RECEIVING_APPLICATIONS];
  
  // Get available next stages with safety check
  const availableStages = Object.values(HIRING_STAGES)
    .filter(stage => stage && currentStageInfo && stage.order > currentStageInfo.order)
    .sort((a, b) => a.order - b.order);

  const handleStageAdvance = (targetStage: HiringStage) => {
    setSelectedStage(targetStage);
    setShowConfirmModal(true);
    setNotes('');
  };

  const confirmStageAdvance = async () => {
    if (!selectedStage) return;

    const success = await advanceStage(job.id, selectedStage, notes);
    if (success) {
      setShowConfirmModal(false);
      setSelectedStage(null);
      setNotes('');
      onStageChanged?.(job);
    }
  };

  const cancelStageAdvance = () => {
    setShowConfirmModal(false);
    setSelectedStage(null);
    setNotes('');
    reset();
  };

  const getStageColor = (stage: HiringStage) => {
    const colors = {
      [HiringStage.RECEIVING_APPLICATIONS]: 'bg-green-100 text-green-800',
      [HiringStage.REVIEWING_APPLICATIONS]: 'bg-blue-100 text-blue-800',
      [HiringStage.INTERVIEWS]: 'bg-purple-100 text-purple-800',
      [HiringStage.BACKGROUND_CHECK]: 'bg-yellow-100 text-yellow-800',
      [HiringStage.HIRING_PROCESS]: 'bg-orange-100 text-orange-800',
      [HiringStage.CLOSED]: 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Current Stage Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estado Actual del Proceso
            </h3>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStageColor(currentStage)}`}>
                {currentStageInfo.label}
              </span>
              <span className="text-sm text-gray-600">
                Etapa {currentStageInfo.order} de 6
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {currentStageInfo.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Progreso del proceso</span>
              <span>{Math.round((currentStageInfo.order / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStageInfo.order / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Stage History */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Historial de Etapas
            </h4>
            <div className="space-y-2">
              {job.progress?.stageHistory?.length ? (
                job.progress.stageHistory.map((transition, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="font-medium">
                      {HIRING_STAGES[transition.toStage]?.label || 'Etapa desconocida'}
                    </span>
                    <span className="text-gray-500">
                      {formatDate(transition.transitionDate)}
                    </span>
                    {transition.notes && (
                      <span className="text-gray-600 italic">
                        - {transition.notes}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="font-medium">
                    {currentStageInfo.label}
                  </span>
                  <span className="text-gray-500">
                    {formatDate(job.createdAt)}
                  </span>
                  <span className="text-gray-600 italic">
                    - Trabajo creado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stage Actions */}
          {availableStages.length > 0 && currentStage !== HiringStage.CLOSED && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Avanzar Proceso
              </h4>
              <div className="space-y-2">
                {availableStages.slice(0, 2).map((stage) => (
                  <Button
                    key={stage.stage}
                    variant="secondary"
                    onClick={() => handleStageAdvance(stage.stage)}
                    disabled={advancing}
                    className="w-full justify-start"
                  >
                    <div className="text-left">
                      <div className="font-medium">
                        Avanzar a: {stage.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {stage.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Visibility Status */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Estado de Visibilidad
                </h4>
                <p className="text-xs text-gray-600">
                  {currentStageInfo.isVisible && currentStageInfo.allowsApplications
                    ? 'Visible para candidatos - Recibiendo postulaciones'
                    : currentStageInfo.isVisible
                    ? 'Visible para candidatos - No recibe postulaciones'
                    : 'No visible para candidatos'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {currentStageInfo.isVisible ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                <span className="text-sm text-gray-600">
                  {currentStageInfo.allowsApplications ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert type="error">
              {error}
            </Alert>
          )}

          {/* Success Display */}
          {success && (
            <Alert type="success">
              Etapa avanzada exitosamente
            </Alert>
          )}
        </div>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmModal}
          onClose={cancelStageAdvance}
          title="Confirmar Avance de Etapa"
        >
          <ModalBody>
            {selectedStage && (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700">
                    ¿Estás seguro de que quieres avanzar el proceso a la siguiente etapa?
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">
                      {HIRING_STAGES[selectedStage].label}
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      {HIRING_STAGES[selectedStage].description}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Agrega notas sobre este cambio de etapa..."
                  />
                </div>

                {selectedStage === HiringStage.REVIEWING_APPLICATIONS && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="text-yellow-600 mt-1">
                        ⚠️
                      </div>
                      <div className="ml-2 text-sm">
                        <div className="font-medium text-yellow-800">
                          Importante
                        </div>
                        <div className="text-yellow-700">
                          Al avanzar a esta etapa, el trabajo dejará de ser visible para nuevos candidatos y no se recibirán más postulaciones.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === HiringStage.CLOSED && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="text-red-600 mt-1">
                        🚫
                      </div>
                      <div className="ml-2 text-sm">
                        <div className="font-medium text-red-800">
                          Proceso Finalizado
                        </div>
                        <div className="text-red-700">
                          Al cerrar el proceso, ya no será visible para ningún usuario y no se podrá revertir esta acción.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={cancelStageAdvance}
              disabled={advancing}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmStageAdvance}
              disabled={advancing}
            >
              {advancing ? 'Avanzando...' : 'Confirmar Avance'}
            </Button>
          </ModalFooter>
        </Modal>
      </CardContent>
    </Card>
  );
};
