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

// Define pagination metadata type
interface PaginationMetadata {
  page: number;
  per_page: number;
  total_results: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Update context type to include pagination related states and actions
interface TramitContextType {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  results: Tramit[];
  selected: Tramit[];
  toggleTramit: (tramit: Tramit) => void;
  setSelected: React.Dispatch<React.SetStateAction<Tramit[]>>;
  recommended: Tramit | null;
  isLoading: boolean;
  hasMoreResults: boolean;
  loadNextPage: () => Promise<void>;
  pagination: PaginationMetadata | null;
}

const TramitContext = createContext<TramitContextType | undefined>(undefined);

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
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);

  // Using the debounced search hook
  const debouncedQuery = useDebouncedSearch(query);

  const search = async (q: string, page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/search?q=${encodeURI(q)}&page=${page}&per_page=10`
      );

      if (page === 1) {
        // Reset results for new searches
        setResults(response.data.results);
      } else {
        // Append results for pagination
        setResults((prev) => [...prev, ...response.data.results]);
      }

      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Search error:", error);
      if (page === 1) {
        setResults([]);
        setPagination(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search and new search when query changes
  useEffect(() => {
    const effectiveQuery = debouncedQuery || "";
    search(effectiveQuery, 1); // Reset to page 1 for new searches
  }, [debouncedQuery]);

  const loadNextPage = async () => {
    if (!pagination || !pagination.has_next || isLoading) return;

    const nextPage = pagination.page + 1;
    await search(query, nextPage);
  };

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
        isLoading,
        hasMoreResults: pagination?.has_next ?? false,
        loadNextPage,
        pagination,
      }}
    >
      {children}
    </TramitContext.Provider>
  );
};

export const useTramitContext = (): TramitContextType => {
  const context = useContext(TramitContext);
  if (!context) {
    throw new Error(
      "useTramitContext must be used within a TramitContextProvider"
    );
  }
  return context;
};
