import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property, getAllProperties } from '../lib/properties';

interface PropertiesContextType {
  properties: Property[];
  refreshProperties: () => Promise<void>;
  loading: boolean;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export const PropertiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProperties = async () => {
    try {
      setLoading(true);
      const allProps = await getAllProperties();
      setProperties(allProps);
    } catch (error) {
      console.error('Error refreshing properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProperties();
  }, []);

  return (
    <PropertiesContext.Provider value={{ properties, refreshProperties, loading }}>
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};