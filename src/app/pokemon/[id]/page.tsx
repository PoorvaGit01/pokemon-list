'use client';

import { use } from "react";
import PokemonDetail from "@/components/Pokemon/PokemonDetail";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // unwrap the params Promise
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PokemonDetail id={id} />
    </QueryClientProvider>
  );
}
