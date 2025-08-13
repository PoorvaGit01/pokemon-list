import type { Pokemon, PokemonListResponse, PokemonType } from '../types/pokemon';

// Will take this further from the ENV.
const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'PokemonApiError';
  }
}

const fetchWithTimeout = async (url: string, timeout = 10000, signal?: AbortSignal) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: signal || controller.signal 
    });
    
    if (!response.ok) {
      throw new PokemonApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }
    
    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

export const pokemonApi = {
  async getPokemonList(limit = 20, offset = 0, signal?: AbortSignal): Promise<PokemonListResponse> {
    const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;

    return fetchWithTimeout(url, 10000, signal);
  },

  async getPokemon(id: number | string, signal?: AbortSignal): Promise<Pokemon> {
    const url = `${BASE_URL}/pokemon/${id}`;
    return fetchWithTimeout(url, 10000, signal);
  },

  async getPokemonType(type: string, signal?: AbortSignal): Promise<PokemonType> {
    const url = `${BASE_URL}/type/${type}`;
    return fetchWithTimeout(url, 10000, signal);
  },

  async searchPokemon(query: string, signal?: AbortSignal): Promise<Pokemon | null> {
    if (!query.trim()) return null;
    
    try {
      // Try to fetch by name/id directly
      return await this.getPokemon(query.toLowerCase().trim(), signal);
    } catch (err) {
      // If not found, return null (we'll handle fuzzy search in the component)
      console.warn(err)
      return null;
    }
  },

  // Batch fetch multiple Pokemon
  async getPokemonBatch(ids: number[], signal?: AbortSignal): Promise<Pokemon[]> {
    const promises = ids.map(id => this.getPokemon(id, signal));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<Pokemon> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  },

  // Get all Pokemon types for filtering
  async getPokemonTypes(signal?: AbortSignal): Promise<string[]> {
    const url = `${BASE_URL}/type`;
    const response = await fetchWithTimeout(url, 10000, signal);
    return response.results.map((type: { name: string }) => type.name);
  }
};