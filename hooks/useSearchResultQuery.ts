
import useSWR from "swr";
import { Note } from "@prisma/client";

export interface SearchQueryResult {
    notes: Omit<Note, "content">[];
    error: Error | undefined;
    isLoading: boolean;
}

//TODO: implement proper search query backend
export function useSearchResultQuery(searchTerm: string): SearchQueryResult {
    const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());
    const { data, error, isLoading } = useSWR<Omit<Note, "content">[]>(
        "/api/notes",
        fetcher
    );
    return { notes: data?.slice(0, 5) ?? [], error: error, isLoading: isLoading };
}