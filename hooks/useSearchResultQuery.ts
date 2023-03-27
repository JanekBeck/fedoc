import { NoteSearchPreview } from "@/interfaces/noteSearchPreview";
import { SearchQueryResult } from "@/interfaces/searchQueryResult";
import useSWR from "swr";

export function useSearchResultQuery(searchTerm: string): SearchQueryResult {
    const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

    const {data, error, isLoading} = useSWR<NoteSearchPreview[]>(
        "/api/notes/search?searchTerm=" + searchTerm ,
        fetcher
    );

    return { notes: data?.slice(0, 5) ?? [], error: error, isLoading: isLoading };
}