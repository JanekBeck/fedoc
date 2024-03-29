import { NoteSearchPreview } from "@/interfaces/noteSearchPreview";
import { SearchQueryResult } from "@/interfaces/searchQueryResult";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export function useSearchResultQuery(searchTerm: string): SearchQueryResult {
    const {data, error, isLoading} = useSWR<NoteSearchPreview[]>(
        () => searchTerm !== "" ? "/api/notes/search?searchTerm=" + searchTerm : null,
        fetcher
    );

    return { notes: data?.slice(0, 5) ?? [], error: error, isLoading: isLoading };
}