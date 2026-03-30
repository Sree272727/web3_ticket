// /src/context/PersonaContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import { PERSONAS } from '../data/supportMockData';

const PersonaContext = createContext(null);

export function PersonaProvider({ children }) {
  const [activePersonaId, setActivePersonaId] = useState('tcs-admin');
  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];
  const switchPersona = useCallback((id) => setActivePersonaId(id), []);
  return (
    <PersonaContext.Provider value={{ activePersonaId, activePersona, switchPersona, PERSONAS }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) {
    throw new Error('usePersona must be used inside PersonaProvider');
  }
  return ctx;
}
