import useSWR from "swr";
import {NotePreview} from "@/interfaces/notePreview";
import {fetcher} from "@/lib/fetcher";

export function useNotes() {
    const {
        data: notes,
        mutate: mutateNotes,
        error,
        isLoading,
    } = useSWR<NotePreview[]>("/api/notes", fetcher);

    return {notes, mutateNotes, error, isLoading};
}
