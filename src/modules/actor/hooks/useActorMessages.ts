'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { actorJobService } from '../services';
import { ActorMessage } from '../types';
import { useAuth } from '@/modules/auth';
import { UserRole } from '@/modules/onboarding/types';

interface UseActorMessagesState {
  messages: ActorMessage[];
  loading: boolean;
  error: string | null;
}

interface UseActorMessagesReturn extends UseActorMessagesState {
  markAsRead: (messageId: string) => Promise<void>;
  unreadCount: number;
}

const defaultState: UseActorMessagesState = {
  messages: [],
  loading: false,
  error: null
};

export const useActorMessages = (): UseActorMessagesReturn => {
  const { user, userProfile } = useAuth();
  const [state, setState] = useState<UseActorMessagesState>(defaultState);

  useEffect(() => {
    if (!user?.uid || userProfile?.role !== UserRole.ACTOR) {
      setState(defaultState);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const unsubscribe = actorJobService.subscribeToMessages(
      user.uid,
      messages => {
        setState({ messages, loading: false, error: null });
      },
      error => {
        setState({ messages: [], loading: false, error: error.message });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid, userProfile?.role]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await actorJobService.markMessageAsRead(messageId);
    } catch (error) {
      console.error('No fue posible marcar el mensaje como leído:', error);
    }
  }, []);

  const unreadCount = useMemo(() => state.messages.filter(message => !message.readAt).length, [state.messages]);

  return {
    ...state,
    markAsRead,
    unreadCount
  };
};
