'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

type AudioPlaybackApi = {
  notifyPlay: (id: string, element: HTMLAudioElement) => void;
};

const AudioPlaybackContext = createContext<AudioPlaybackApi | null>(null);

export function AudioPlaybackProvider({ children }: { children: ReactNode }) {
  const currentRef = useRef<{ id: string; element: HTMLAudioElement } | null>(null);

  const notifyPlay = useCallback((id: string, element: HTMLAudioElement) => {
    const current = currentRef.current;
    if (current && current.id !== id) {
      current.element.pause();
    }
    currentRef.current = { id, element };
  }, []);

  const value = useMemo(() => ({ notifyPlay }), [notifyPlay]);

  return (
    <AudioPlaybackContext.Provider value={value}>{children}</AudioPlaybackContext.Provider>
  );
}

export function useAudioPlayback() {
  return useContext(AudioPlaybackContext);
}
