"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { Search, SortAsc, Heart, X } from "lucide-react";
import { PokemonCard } from "./PokemonCard";
import { Pagination } from "../Pagination";
import { PokemonCardSkeleton, SearchFiltersSkeleton } from "../LoadingSkeleton";
import { ErrorState, EmptyState } from "../ErrorState";
import { useUrlState } from "../../hooks/useUrlState";
import { useFavorites } from "../../hooks/useFavorites";
import { pokemonApi } from "../../services/pokemonApi";
import {
  getPokemonIdFromUrl,
  sortPokemon,
  formatPokemonName,
} from "../../utils/pokemonHelpers";
import { useDebounce } from "../../hooks/useDebounce";
import type { SearchFilters } from "@/types/pokemon";

const ITEMS_PER_PAGE = 20;

/* ---------------- Search Filters (Merged) ---------------- */
interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (updates: Partial<SearchFilters>) => void;
  pokemonTypes: string[];
  isLoading?: boolean;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  pokemonTypes,
  isLoading = false,
}) => {
  const [searchInput, setSearchInput] = useState(filters.query);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(searchInput, 800);

  useEffect(() => {
    if (debouncedSearch !== filters.query) {
      const wasInputFocused = inputRef.current === document.activeElement;
      onFiltersChange({ query: debouncedSearch });
      
      // Restore focus after the update if input was previously focused
      if (wasInputFocused && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  }, [debouncedSearch, filters.query, onFiltersChange]);

  // Only sync external changes to searchInput when it's not from user typing
  useEffect(() => {
    // Don't update if the input is currently focused (user is typing)
    if (inputRef.current !== document.activeElement) {
      setSearchInput(filters.query);
    }
  }, [filters.query]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    inputRef.current?.focus(); // Keep focus after clearing
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onFiltersChange({
      query: "",
      type: "",
      sort: "id",
      favorites: false,
      page: 1,
    });
    inputRef.current?.focus(); // Keep focus after clearing
  };

  const hasActiveFilters =
    filters.query || filters.type || filters.favorites || filters.sort !== "id";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Pokémon by name or ID..."
            value={searchInput}
            onChange={handleSearchInputChange}
            className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className="relative min-w-[150px] z-10">
          <select
            value={filters.type}
            onChange={(e) => onFiltersChange({ type: e.target.value, page: 1 })}
            className="appearance-none w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">All Types</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {formatPokemonName(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative min-w-[150px] z-10">
          <SortAsc
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={filters.sort}
            onChange={(e) =>
              onFiltersChange({
                sort: e.target.value as SearchFilters["sort"],
                page: 1,
              })
            }
            className="pl-10 w-full py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="id">ID (Default)</option>
            <option value="name">Name (A-Z)</option>
            <option value="height">Height (Tallest)</option>
            <option value="weight">Weight (Heaviest)</option>
          </select>
        </div>

        {/* Favorites */}
        <button
          onClick={() =>
            onFiltersChange({ favorites: !filters.favorites, page: 1 })
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            filters.favorites
              ? "bg-red-500 text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
          disabled={isLoading}
        >
          <Heart
            size={16}
            fill={filters.favorites ? "currentColor" : "none"}
          />
          Favorites
        </button>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            disabled={isLoading}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

/* ---------------- Main Pokemon Component ---------------- */
export const Pokemon: React.FC = () => {
  const { filters, updateFilters } = useUrlState();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [filters]);

  const { data: pokemonTypes = [] } = useQuery({
    queryKey: ["pokemon-types"],
    queryFn: ({ signal }) => pokemonApi.getPokemonTypes(signal),
    staleTime: Infinity,
  });

  const {
    data: pokemonListData,
    isLoading: isLoadingList,
    error: listError,
    refetch: refetchList,
  } = useQuery({
    queryKey: ["pokemon-list", filters.page],
    queryFn: ({ signal }) => {
      abortControllerRef.current = new AbortController();
      const offset = (filters.page - 1) * ITEMS_PER_PAGE;
      return pokemonApi.getPokemonList(ITEMS_PER_PAGE, offset, signal);
    },
    enabled: !filters.query && !filters.type && !filters.favorites,
  });

  const {
    data: searchResult,
    isLoading: isLoadingSearch,
    error: searchError,
    isFetched: isSearchFetched,
  } = useQuery({
    queryKey: ["pokemon-search", filters.query],
    queryFn: ({ signal }) => pokemonApi.searchPokemon(filters.query, signal),
    enabled: !!filters.query && !filters.favorites,
  });

  const {
    data: typeData,
    isLoading: isLoadingType,
    error: typeError,
  } = useQuery({
    queryKey: ["pokemon-type", filters.type],
    queryFn: ({ signal }) => pokemonApi.getPokemonType(filters.type, signal),
    enabled: !!filters.type && !filters.favorites,
  });

  const pokemonIds = useMemo(() => {
    if (filters.favorites) {
      return Array.from(favorites);
    }
    
    // Handle combined search + type filter
    if (filters.query && filters.type) {
      if (!searchResult || !typeData) return [];
      
      // Check if the search result matches the type filter
      const typePokemons = typeData.pokemon.map((p) => getPokemonIdFromUrl(p.pokemon.url));
      const searchResultInType = typePokemons.includes(searchResult.id);
      
      return searchResultInType ? [searchResult.id] : [];
    }
    
    // Handle search only
    if (filters.query) {
      return searchResult ? [searchResult.id] : [];
    }
    
    // Handle type filter only
    if (filters.type && typeData) {
      return typeData.pokemon.map((p) => getPokemonIdFromUrl(p.pokemon.url));
    }
    
    // Default list
    if (pokemonListData) {
      return pokemonListData.results.map((p) => getPokemonIdFromUrl(p.url));
    }
    
    return [];
  }, [filters, favorites, searchResult, typeData, pokemonListData]);

  const {
    data: pokemonDetails = [],
    isLoading: isLoadingDetails,
    error: detailsError,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ["pokemon-details", pokemonIds],
    queryFn: ({ signal }) => pokemonApi.getPokemonBatch(pokemonIds, signal),
    enabled: pokemonIds.length > 0,
  });

  const filteredPokemon = useMemo(() => {
    let result = [...pokemonDetails];
    result = sortPokemon(result, filters.sort);
    if (filters.favorites) {
      result = result.filter((pokemon) => isFavorite(pokemon.id));
    }
    return result;
  }, [pokemonDetails, filters.sort, filters.favorites, isFavorite]);

  const totalItems = filteredPokemon.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
  const paginatedPokemon = filteredPokemon.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const isLoading =
    isLoadingList || isLoadingSearch || isLoadingType || isLoadingDetails;
  const error = listError || searchError || typeError || detailsError;

  // Check if search was performed but no results found (considering type filter)
  const isSearchNotFound = filters.query && isSearchFetched && (
    (!searchResult && !isLoadingSearch) ||
    (filters.type && searchResult && typeData && !typeData.pokemon.map((p) => getPokemonIdFromUrl(p.pokemon.url)).includes(searchResult.id))
  );

  const handleToggleFavorite = (pokemonId: number) => {
    if (isFavorite(pokemonId)) {
      removeFavorite(pokemonId);
    } else {
      addFavorite(pokemonId);
    }
  };

  // Removed auto-scroll on page change for better UX

  const handleRetry = () => {
    if (filters.favorites) {
      refetchDetails();
    } else {
      refetchList();
    }
  };

  return (
    <>
      <Head>
        <title>Pokédex Explorer - Discover Amazing Pokémon</title>
        <meta
          name="description"
          content="Explore the world of Pokémon with our interactive Pokédex. Search, filter, and discover your favorite Pokémon with detailed stats and information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
        Pokémon
      </h1>
        {isLoading && pokemonTypes.length === 0 ? (
          <SearchFiltersSkeleton />
        ) : (
          <SearchFiltersComponent
            filters={filters}
            onFiltersChange={updateFilters}
            pokemonTypes={pokemonTypes}
            isLoading={isLoading}
          />
        )}

        {error && (
          <ErrorState
            title="Failed to load Pokémon"
            message="We couldn't fetch the Pokémon data. Please check your connection and try again."
            onRetry={handleRetry}
          />
        )}

        {isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <PokemonCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Show "not found" state specifically for search */}
        {isSearchNotFound && (
          <EmptyState
            title="No Pokémon found"
            message={
              filters.type 
                ? `We couldn't find any Pokémon matching "${filters.query}" in the ${formatPokemonName(filters.type)} type. Try a different search term or clear the type filter.`
                : `We couldn't find any Pokémon matching "${filters.query}". Please check the spelling and try again.`
            }
            action={
              <div className="flex gap-3">
                <button
                  onClick={() => updateFilters({ query: "" })}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
                {filters.type && (
                  <button
                    onClick={() => updateFilters({ type: "" })}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Type Filter
                  </button>
                )}
              </div>
            }
          />
        )}

        {/* Show empty state for other cases (but not during search loading or when search found nothing) */}
        {!isLoading && !error && !isSearchNotFound && filteredPokemon.length === 0 && (
          <EmptyState
            title={
              filters.favorites
                ? "No favorites yet"
                : "No results"
            }
            message={
              filters.favorites
                ? "Start exploring and add some Pokémon to your favorites!"
                : "Try adjusting your filters to see more results."
            }
            action={
              <button
                onClick={() =>
                  updateFilters({
                    query: "",
                    type: "",
                    favorites: false,
                    sort: "id",
                    page: 1,
                  })
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            }
          />
        )}

        {!isLoading && !error && !isSearchNotFound && paginatedPokemon.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {paginatedPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isFavorite={isFavorite(pokemon.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && !isSearchNotFound && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(page) => updateFilters({ page })}
              isLoading={isLoading}
            />
          </div>
        )}

        {!isLoading && !error && !isSearchNotFound && filteredPokemon.length > 0 && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems}{" "}
            Pokémon
          </div>
        )}
      </div>
    </>
  );
};