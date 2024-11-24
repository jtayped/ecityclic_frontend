import { useState, useEffect } from "react";

export const useDebouncedSearch = (query: string, delay: number = 500) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer); // Cleanup previous timeout if query changes
    };
  }, [query, delay]);

  return debouncedQuery;
};
