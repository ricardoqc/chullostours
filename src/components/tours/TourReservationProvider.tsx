"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Tour } from "@/types/tour";
import type { ReservationInitialSelection } from "./reservation/types";
import { ReservationModal } from "./ReservationModal";

interface TourReservationContextValue {
  isOpen: boolean;
  selection: ReservationInitialSelection;
  /** Abre el modal. Los campos recibidos se fusionan con la selección vigente. */
  openReservation: (override?: ReservationInitialSelection) => void;
  closeReservation: () => void;
  /** Sincroniza la selección sin abrir el modal. */
  updateSelection: (updates: ReservationInitialSelection) => void;
}

const TourReservationContext = createContext<TourReservationContextValue | null>(
  null
);

interface TourReservationProviderProps {
  tour: Tour;
  defaultSelection?: ReservationInitialSelection;
  children: React.ReactNode;
}

export function TourReservationProvider({
  tour,
  defaultSelection,
  children,
}: TourReservationProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState<ReservationInitialSelection>(
    defaultSelection ?? {}
  );

  const updateSelection = useCallback((updates: ReservationInitialSelection) => {
    setSelection((prev) => ({ ...prev, ...updates }));
  }, []);

  const openReservation = useCallback(
    (override?: ReservationInitialSelection) => {
      if (override) setSelection((prev) => ({ ...prev, ...override }));
      setIsOpen(true);
    },
    []
  );

  const closeReservation = useCallback(() => setIsOpen(false), []);

  const value = useMemo<TourReservationContextValue>(
    () => ({
      isOpen,
      selection,
      openReservation,
      closeReservation,
      updateSelection,
    }),
    [isOpen, selection, openReservation, closeReservation, updateSelection]
  );

  return (
    <TourReservationContext.Provider value={value}>
      {children}
      {isOpen && (
        <ReservationModal
          isOpen
          onClose={closeReservation}
          tour={tour}
          initialSelection={selection}
        />
      )}
    </TourReservationContext.Provider>
  );
}

export function useTourReservation(): TourReservationContextValue {
  const context = useContext(TourReservationContext);
  if (!context) {
    throw new Error(
      "useTourReservation debe usarse dentro de TourReservationProvider"
    );
  }
  return context;
}

/** Variante tolerante para componentes que también se renderizan fuera del provider. */
export function useOptionalTourReservation(): TourReservationContextValue | null {
  return useContext(TourReservationContext);
}
