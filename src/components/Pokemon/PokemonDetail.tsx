'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { pokemonApi } from '../../services/pokemonApi';
import { useFavorites } from '../../hooks/useFavorites';
import { PokemonDetailSkeleton } from '../LoadingSkeleton';
import { ErrorState } from '../ErrorState';
import {
  formatPokemonName,
  formatStatName,
  getImageUrl,
} from '../../utils/pokemonHelpers';

export default function PokemonDetail({ id }: { id: string }) {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const {
    data: pokemon,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: ({ signal }) => pokemonApi.getPokemon(id, signal),
    enabled: !!id,
  });

  const handleToggleFavorite = () => {
    if (!pokemon) return;

    if (isFavorite(pokemon.id)) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon.id);
    }
  };

  if (isLoading) {
    return <PokemonDetailSkeleton />;
  }

  if (error || !pokemon) {
    return (
      <ErrorState
        title="Pokémon not found"
        message="We couldn't find the Pokémon you're looking for. It might have been moved or doesn't exist."
        onRetry={refetch}
        showHomeButton
      />
    );
  }

  const maxStat = Math.max(...pokemon.stats.map(s => s.base_stat));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/pokemon')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-2 py-1"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleToggleFavorite}
              className={`p-3 rounded-full transition-all duration-200 ${
                isFavorite(pokemon.id)
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label={`${isFavorite(pokemon.id) ? 'Remove from' : 'Add to'} favorites`}
            >
              <Heart 
                size={24} 
                fill={isFavorite(pokemon.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              {formatPokemonName(pokemon.name)}
            </h1>
            <div className="flex justify-center gap-2 mb-4">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className="px-4 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm"
                >
                  {formatPokemonName(type.name)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={getImageUrl(pokemon)}
                  alt={`${formatPokemonName(pokemon.name)} official artwork`}
                  width={320}
                  height={320}
                  className="w-80 h-80 object-contain drop-shadow-2xl"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  priority
                  onError={() => {
                    // Fallback handled by Next.js Image component
                    console.warn(`Failed to load image for ${pokemon.name}`);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Base Stats
                </h2>
                <div className="space-y-3">
                  {pokemon.stats.map(({ base_stat, stat }) => (
                    <div key={stat.name} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">
                        {formatStatName(stat.name)}
                      </div>
                      <div className="w-12 text-sm font-bold text-gray-900 dark:text-white text-center">
                        {base_stat}
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${(base_stat / maxStat) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <strong>Total:</strong> {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(pokemon.height / 10).toFixed(1)}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Height</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(pokemon.weight / 10).toFixed(1)}kg
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pokemon.base_experience || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Base EXP</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pokemon.abilities.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Abilities</div>
            </div>
          </div>

          {/* Abilities */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Abilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <div
                  key={ability.name}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPokemonName(ability.name)}
                  </span>
                  {is_hidden && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      Hidden
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            {pokemon.id > 1 && (
              <Link
                href={`/pokemon/${pokemon.id - 1}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <ArrowLeft size={16} />
                Previous
              </Link>
            )}
            
            <div className="flex-1" />
            
            <Link
              href={`/pokemon/${pokemon.id + 1}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Next
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}