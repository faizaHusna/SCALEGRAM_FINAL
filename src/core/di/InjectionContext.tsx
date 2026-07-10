import React, { createContext, useContext } from 'react';
import { DIContainer, IDIContainer } from './container';

// Context murni memegang Abstraksi Kontrak (Interface)
const DIContext = createContext<IDIContainer>(DIContainer);

interface InjectionProviderProps {
  children: React.ReactNode;
  container: IDIContainer; // Diwajibkan menerima dari luar (Inversion of Control)
}

export const InjectionProvider: React.FC<InjectionProviderProps> = ({ children, container }) => {
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
};

export const useInjection = () => {
  return useContext(DIContext);
};