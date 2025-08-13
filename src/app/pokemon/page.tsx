'use client'

import { Pokemon } from "@/components/Pokemon/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Pokemon />
    </QueryClientProvider>

    </>
  );
}
