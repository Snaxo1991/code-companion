import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DeliveryArea {
  id: string;
  name: string;
  fee: number;
}

interface DeliveryAreaContextType {
  selectedArea: DeliveryArea | null;
  setSelectedArea: (area: DeliveryArea | null) => void;
}

const DeliveryAreaContext = createContext<DeliveryAreaContextType | undefined>(undefined);

const AREA_STORAGE_KEY = 'snaxo-delivery-area';

export function DeliveryAreaProvider({ children }: { children: ReactNode }) {
  const [selectedArea, setSelectedArea] = useState<DeliveryArea | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(AREA_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  useEffect(() => {
    if (selectedArea) {
      localStorage.setItem(AREA_STORAGE_KEY, JSON.stringify(selectedArea));
    } else {
      localStorage.removeItem(AREA_STORAGE_KEY);
    }
  }, [selectedArea]);

  return (
    <DeliveryAreaContext.Provider value={{ selectedArea, setSelectedArea }}>
      {children}
    </DeliveryAreaContext.Provider>
  );
}

export function useDeliveryArea() {
  const context = useContext(DeliveryAreaContext);
  if (!context) {
    throw new Error('useDeliveryArea must be used within a DeliveryAreaProvider');
  }
  return context;
}
