"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { SearchFilters } from "../types/pokemon";

// Wrapper component to handle the suspense boundary
const useSearchParamsWithFallback = () => {
  try {
    return useSearchParams();
  } catch (error) {
    // During SSR or when suspense boundary is missing, return empty URLSearchParams
    console.warn(error)
    return new URLSearchParams();
  }
};

export const useUrlState = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParamsWithFallback();

  const filters: SearchFilters = useMemo(() => ({
    query: searchParams.get("query") || "",
    type: searchParams.get("type") || "normal",
    sort: (searchParams.get("sort") as SearchFilters["sort"]) || "id",
    page: parseInt(searchParams.get("page") || "1", 10),
    favorites: searchParams.get("favorites") === "true",
  }), [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<SearchFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === false || (key === "page" && value === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset page to 1 if changing filters (not just page)
      if (Object.keys(updates).some((key) => key !== "page")) {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return { filters, updateFilters };
};