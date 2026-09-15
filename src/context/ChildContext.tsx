import React, { createContext, useContext, useState, useEffect } from 'react';
import { Child } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface ChildContextType {
  childrenList: Child[];
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
  isLoading: boolean;
  refreshChildren: () => Promise<void>;
  createChild: (data: Partial<Child>) => Promise<Child>;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const ChildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChildren = async () => {
    if (!user) {
      setChildrenList([]);
      setSelectedChild(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.getChildren();
      setChildrenList(data);
      if (data.length > 0) {
        // Keep current selected child if still exists, else pick first
        setSelectedChild(prev => {
          if (prev) {
            const found = data.find(c => c.id === prev.id);
            if (found) return found;
          }
          return data[0];
        });
      } else {
        setSelectedChild(null);
      }
    } catch (err) {
      console.error('Failed to fetch children:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [user]);

  const createChild = async (data: Partial<Child>): Promise<Child> => {
    const newChild = await api.createChild(data);
    await fetchChildren();
    setSelectedChild(newChild);
    return newChild;
  };

  return (
    <ChildContext.Provider
      value={{
        childrenList,
        selectedChild,
        setSelectedChild,
        isLoading,
        refreshChildren: fetchChildren,
        createChild,
      }}
    >
      {children}
    </ChildContext.Provider>
  );
};

export const useChild = () => {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};
