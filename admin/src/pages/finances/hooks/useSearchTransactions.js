import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export const useSearchTransactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    page,
    setPage,
  };
}; 