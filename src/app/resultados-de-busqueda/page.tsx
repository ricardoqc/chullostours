import React, { Suspense } from "react";
import { getAllTours } from "@/lib/tours";
import { SearchResultsClient } from "./search-results-client";

export default function SearchResultsPage() {
  const tours = getAllTours();

  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando resultados de búsqueda...</div>}>
      <SearchResultsClient tours={tours} />
    </Suspense>
  );
}
