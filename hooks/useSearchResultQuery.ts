import useSWR from "swr";
import { Note } from "@prisma/client";
import {fetcher} from "@/lib/fetcher";
import {NotePreview} from "@/interfaces/notePreview";

export interface SearchQueryResult {
    notes: NotePreview[];
    error: Error | undefined;
    isLoading: boolean;
}

//TODO: implement proper search query backend
export function useSearchResultQuery(searchTerm: string): SearchQueryResult {
    const { data, error, isLoading } = useSWR<NotePreview[]>(
        "/api/notes",
        fetcher
    );
    return { notes: data?.slice(0, 5) ?? [], error: error, isLoading: isLoading };
}