"use client";

import { useDebouncedSearch } from "@/hooks/debounce";
import { Tramit } from "@/types/tramit";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// 1. Define the types for the context state and actions
interface TramitContextType {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  results: Tramit[];
  selected: Tramit[];
  toggleTramit: (tramit: Tramit) => void;
  setSelected: React.Dispatch<React.SetStateAction<Tramit[]>>;
  recommended: Tramit | null;
}

// 2. Create the context with the correct type
const TramitContext = createContext<TramitContextType | undefined>(undefined);

// 3. Define the provider's props
interface TramitContextProviderProps {
  children: ReactNode;
}

export const TramitContextProvider: React.FC<TramitContextProviderProps> = ({
  children,
}) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Tramit[]>([]);
  const [selected, setSelected] = useState<Tramit[]>([]);
  const [recommended, setRecommended] = useState<Tramit | null>(null);

  // Using the debounced search hook
  const debouncedQuery = useDebouncedSearch(query);

  useEffect(() => {
    const search = async (q: string) => {
      try {
        const response = await axios.get(`/api/search?q=${encodeURI(q)}`);
        setResults(response.data.results);
      } catch {
        setResults([]);
      }
    };

    // Use "a" as the default query if nothing is typed
    const effectiveQuery = debouncedQuery || "a";

    search(effectiveQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await axios.post("/api/predict", {
          sequence: selected.map((s) => s.id),
        });
        setRecommended(response.data.predicted_tramit);
      } catch (error) {
        console.error(error);
      }
    };

    if (selected.length > 0) fetchRecommended();
  }, [selected]);
  const toggleTramit = (tramit: Tramit) => {
    setSelected((prev) => {
      if (prev.find((t) => t.id === tramit.id)) {
        return prev.filter((t) => t.id !== tramit.id);
      } else {
        return [...prev, tramit];
      }
    });
  };

  return (
    <TramitContext.Provider
      value={{
        query,
        setQuery,
        results,
        selected,
        toggleTramit,
        setSelected,
        recommended,
      }}
    >
      {children}
    </TramitContext.Provider>
  );
};

// 4. Create a custom hook for consuming the context
export const useTramitContext = (): TramitContextType => {
  const context = useContext(TramitContext);
  if (!context) {
    throw new Error(
      "useTramitContext must be used within a TramitContextProvider"
    );
  }
  return context;
};
