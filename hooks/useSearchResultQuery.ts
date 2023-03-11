
import { NotePreview } from "@/pages/api/notes/search";
import useSWR from "swr";

export interface SearchQueryResult {
    notes: NotePreview[];
    error: Error | undefined;
    isLoading: boolean;
}

export function useSearchResultQuery(searchTerm: string): SearchQueryResult {
    const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

    const {data, error, isLoading} = useSWR<NotePreview[]>(
        "/api/notes/search?searchTerm=" + searchTerm ,
        fetcher
    );

    return { notes: data?.slice(0, 5) ?? [], error: error, isLoading: isLoading };
}