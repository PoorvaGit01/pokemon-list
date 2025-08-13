import type { Pokemon } from '../types/pokemon';

export const getPokemonIdFromUrl = (url: string): number => {
  const segments = url.split('/');
  return parseInt(segments[segments.length - 2], 10);
};

export const formatPokemonName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
};

export const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-blue-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-purple-600',
    dark: 'bg-gray-800',
    steel: 'bg-gray-600',
    fairy: 'bg-pink-400',
  };
  return colors[type] || 'bg-gray-400';
};

export const formatStatName = (name: string): string => {
  const statNames: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    'speed': 'Speed',
  };
  return statNames[name] || formatPokemonName(name);
};

export const sortPokemon = (pokemon: Pokemon[], sortBy: string): Pokemon[] => {
  return [...pokemon].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'height':
        return b.height - a.height;
      case 'weight':
        return b.weight - a.weight;
      case 'id':
      default:
        return a.id - b.id;
    }
  });
};

export const getImageUrl = (pokemon: Pokemon): string => {
  return pokemon.sprites.other['official-artwork'].front_default ||
         pokemon.sprites.other.home.front_default ||
         pokemon.sprites.front_default ||
         '/pokemon-placeholder.png';
};