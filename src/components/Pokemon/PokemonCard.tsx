"use client";

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Pokemon } from '../../types/pokemon';
import { formatPokemonName, getTypeColor, getImageUrl } from '../../utils/pokemonHelpers';
import Image from 'next/image';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };

  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="group relative block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="relative p-6">
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-700'
          }`}
          aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
        >
          <Heart 
            size={20} 
            fill={isFavorite ? 'currentColor' : 'none'}
            className="transition-transform duration-200 group-hover:scale-110"
          />
        </button>

        {/* Pokemon Image */}
        <div className="relative mb-4 flex justify-center">
          <div className="relative w-32 h-32">
              <Image
                src={getImageUrl(pokemon)}
                alt={`${formatPokemonName(pokemon.name)} artwork`}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/128/128';
                }}
                sizes="(max-width: 768px) 128px, 256px"
              />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Pokemon Info */}
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {formatPokemonName(pokemon.name)}
          </h3>

          {/* Types */}
          <div className="flex justify-center gap-2 mb-3">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(
                  type.name
                )}`}
              >
                {formatPokemonName(type.name)}
              </span>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              <div className="font-medium">Height</div>
              <div>{(pokemon.height / 10).toFixed(1)}m</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
              <div className="font-medium">Weight</div>
              <div>{(pokemon.weight / 10).toFixed(1)}kg</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};